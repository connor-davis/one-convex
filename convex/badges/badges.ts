import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";

export const getAvailableBadges = query({
  handler: async (ctx) => {
    const badgeCategories = await ctx.db.query("badgeCategories").collect();

    const badgesByCategory: Record<string, Doc<"badges">[]> = {};

    for (const badgeCategory of badgeCategories) {
      const badges = await ctx.db
        .query("badges")
        .filter((q) => q.eq(q.field("categoryId"), badgeCategory._id))
        .collect();

      if (badges.length > 0) {
        badgesByCategory[badgeCategory.name] = badges;
      }
    }

    const uncategorizedBadges = await ctx.db
      .query("badges")
      .filter((q) => q.eq(q.field("categoryId"), null))
      .collect();

    if (uncategorizedBadges.length > 0) {
      badgesByCategory["Other"] = uncategorizedBadges;
    }

    return badgesByCategory;
  },
});

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
    imageId: v.optional(v.union(v.id("_storage"), v.null())),
    name: v.string(),
    description: v.string(),
    points: v.number(),
    categoryId: v.optional(v.union(v.id("badgeCategories"), v.null())),
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
    imageId: v.optional(v.union(v.id("_storage"), v.null())),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    points: v.optional(v.number()),
    categoryId: v.optional(v.union(v.id("badgeCategories"), v.null())),
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
