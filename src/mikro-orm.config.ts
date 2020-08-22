import path from "path";
import dotenv from "dotenv";
import { MikroORM } from "@mikro-orm/core";

// Constants
import { isProd } from "./constants";

// Entities
import { User } from "./entities/User";
import { Post } from "./entities/Post";

dotenv.config();

export default {
	migrations: {
		path: path.join(__dirname, "./migrations"),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	entities: [User, Post],
	dbName: "lireddit",
	type: "postgresql",
	debug: !isProd,
} as Parameters<typeof MikroORM.init>[0];
