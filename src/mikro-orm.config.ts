import path from "path";
import dotenv from "dotenv";

import { Post } from "./entities/Post";
import { isProd } from "./constants";
import { MikroORM } from "@mikro-orm/core";

dotenv.config();

export default {
	migrations: {
		path: path.join(__dirname, "./migrations"),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	entities: [Post],
	dbName: "lireddit",
	type: "postgresql",
	debug: !isProd,
} as Parameters<typeof MikroORM.init>[0];
