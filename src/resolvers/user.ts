import { Resolver, Mutation, Ctx, Arg, InputType, Field, ObjectType, Query } from "type-graphql";
import { User } from "../entities/User";
import * as argon2 from "argon2";

// Typings
import { AppContext } from "../typings";

@InputType()
class AuthInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() { req, db }: AppContext): Promise<User | null> {
		if (!req.session.userId) {
			return null;
		}

		const user = await db.findOne(User, { id: req.session.userId });
		return user;
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg("registerInput") registerInput: AuthInput,
		@Ctx() { db, req }: AppContext,
	): Promise<UserResponse> {
		if (registerInput.username.length <= 2) {
			return {
				errors: [{ field: "username", message: "Username must have at least 3 characters" }],
			};
		}
		if (registerInput.password.length <= 2) {
			return {
				errors: [{ field: "password", message: "Password must have at least 3 characters" }],
			};
		}

		const hashedPassword = await argon2.hash(registerInput.password);
		const user = db.create(User, {
			username: registerInput.username,
			password: hashedPassword,
		});

		try {
			await db.persistAndFlush(user);
		} catch (e) {
			// duplicate username
			if (e.code === "23505") {
				return {
					errors: [{ field: "username", message: "Username already taken" }],
				};
			}
		}

		// Auto log user in
		req.session.userId = user.id;

		return { user };
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg("loginInput") loginInput: AuthInput,
		@Ctx() { db, req }: AppContext,
	): Promise<UserResponse> {
		const user = await db.findOne(User, { username: loginInput.username });
		if (!user) {
			return {
				errors: [{ field: "username", message: "Invalid credentials" }],
			};
		}
		const isPasswordValid = await argon2.verify(user.password, loginInput.password);

		if (!isPasswordValid) {
			return {
				errors: [{ field: "password", message: "Invalid credentials" }],
			};
		}

		req.session.userId = user.id;

		return { user };
	}
}
