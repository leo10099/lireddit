import { Resolver, Mutation, Query, Ctx, Arg } from "type-graphql";
import { Post } from "../entities/Post";

// Typings
import { AppContext } from "../typings";

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(@Ctx() { db }: AppContext): Promise<Post[]> {
		return db.find(Post, {});
	}

	@Query(() => Post, { nullable: true })
	post(@Arg("id") id: number, @Ctx() { db }: AppContext): Promise<Post | null> {
		return db.findOne(Post, { id });
	}

	@Mutation(() => Post)
	async createPost(@Arg("title") title: string, @Ctx() { db }: AppContext): Promise<Post | null> {
		const post = db.create(Post, { title });
		await db.persistAndFlush(post);

		return post;
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg("id") id: number,
		@Arg("title", () => String, { nullable: true }) title: string,
		@Ctx() { db }: AppContext,
	): Promise<Post | null> {
		const post = await db.findOne(Post, { id });

		if (!post || !title) return null;

		post.title = title;
		await db.persistAndFlush(post);

		return post;
	}

	@Mutation(() => Boolean)
	async deletePost(@Arg("id") id: number, @Ctx() { db }: AppContext): Promise<boolean> {
		await db.nativeDelete(Post, { id });
		return true;
	}
}
