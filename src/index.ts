import "reflect-metadata";
import express from "express";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

// Config
import microConfig from "./mikro-orm.config";

// Resolvers
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

// Constants
import { isProd } from "./constants";

const bootstrap = async () => {
	const orm = await MikroORM.init(microConfig);
	await orm.getMigrator().up();

	const app = express();

	const RedisStore = connectRedis(session);
	const redisClient = redis.createClient();

	app.use(
		session({
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365,
				httpOnly: true,
				secure: isProd,
				sameSite: "lax",
			},
			name: "qid",
			store: new RedisStore({
				client: redisClient,
				disableTouch: true,
			}),
			saveUninitialized: false,
			secret: "secret-test",
			resave: false,
		}),
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({ db: orm.em, req, res }),
	});

	apolloServer.applyMiddleware({ app });

	app.listen(4321, () => {
		console.log(`🚀 LiReddit has launched`);
	});
};

bootstrap();
