import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    organizationId: v.nullable(v.string()),
    search: v.string(),
  },
  handler: async (ctx, { paginationOpts, ...args }) => {
    if (args.organizationId !== null) {
      const baseQuery = ctx.db.query("badges");

      let finalQuery;

      if (args.search.length > 0) {
        finalQuery = baseQuery.withSearchIndex("by_search", (q) =>
          q.search("name", args.search),
        );
      }

      finalQuery = finalQuery || baseQuery;

      return await finalQuery
        .filter((q) => q.eq(q.field("organizationId"), args.organizationId!))
        .paginate(paginationOpts);
    }

    throw new Error("Invalid organization ID");
  },
});

export const getOne = query({
  args: {
    id: v.id("badges"),
  },
  handler: async (ctx, { id }) => {
    const badge = await ctx.db.get(id);

    return badge;
  },
});

export const create = mutation({
  args: {
    imageId: v.string(),
    name: v.string(),
    description: v.string(),
    points: v.number(),
    categoryId: v.optional(v.id("badgeCategories")),
    organizationId: v.nullable(v.string()),
  },
  handler: async (ctx, { ...payload }) => {
    if (payload.organizationId === null)
      throw new Error("Invalid organization ID");

    const badgeId = await ctx.db.insert("badges", {
      ...payload,
      organizationId: payload.organizationId,
    });

    return badgeId;
  },
});

export const update = mutation({
  args: {
    id: v.id("badges"),
    imageId: v.optional(v.string()),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    points: v.optional(v.number()),
    categoryId: v.optional(v.id("badgeCategories")),
  },
  handler: async (ctx, { id, ...payload }) => {
    await ctx.db.patch(id, payload);
  },
});

export const remove = mutation({
  args: {
    id: v.id("badges"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
