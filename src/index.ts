import "reflect-metadata";
import microConfig from "./mikro-orm.config";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

// Resolvers
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const bootstrap = async () => {
	const orm = await MikroORM.init(microConfig);
	await orm.getMigrator().up();

	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver],
			validate: false,
		}),
		context: () => ({ db: orm.em }),
	});

	apolloServer.applyMiddleware({ app });

	app.listen(4321, () => {
		console.log(`🚀 LiReddit has launched`);
	});
};

bootstrap();
