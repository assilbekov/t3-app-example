
import { User, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    imageUrl: user.imageUrl,
  };
}

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          content: input.content,
          authorId: ""
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getAll: publicProcedure.query(async ({ctx}) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    const users = (await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
    })).map(filterUserForClient);
    return posts.map((post) => ({
      post,
      author: users.find((user) => user.id === post.authorId),
    }))
  })
});
