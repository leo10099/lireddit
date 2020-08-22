import { Resolver, Query, Ctx } from "type-graphql";
import { Post } from "../entities/Post";

// Typings
import { AppContext } from "../typings";

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(@Ctx() ctx: AppContext): Promise<Post[]> {
		return ctx.db.find(Post, {});
	}
}
