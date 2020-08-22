import { Resolver, Mutation, Query, Ctx, Arg, InputType, Field } from "type-graphql";
import { User } from "../entities/User";
import * as argon2 from "argon2";

// Typings
import { AppContext } from "../typings";

@InputType()
class RegisterInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async register(
		@Arg("registerInput") registerInput: RegisterInput,
		@Ctx() { db }: AppContext,
	): Promise<User> {
		const hashedPassword = await argon2.hash(registerInput.password);
		const user = db.create(User, {
			username: registerInput.username,
			password: hashedPassword,
		});
		await db.persistAndFlush(user);

		return user;
	}
}
