import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type AppContext = {
	db: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
