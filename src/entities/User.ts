import { PrimaryKey, Entity, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export class User {
	@Field(() => Int)
	@PrimaryKey()
	id!: number;

	@Field(() => String)
	@Property({ type: "date" })
	createdAt = new Date();

	@Field(() => String)
	@Property({ type: "date" })
	updatedAt = new Date();

	@Field()
	@Property({ type: "text", unique: true })
	username!: string;

	@Property({ type: "text" })
	password!: string;
}
