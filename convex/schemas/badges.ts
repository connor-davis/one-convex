import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  imageId: v.optional(v.union(v.id("_storage"), v.null())),
  name: v.string(),
  description: v.string(),
  points: v.number(),
  categoryId: v.optional(v.union(v.id("badgeCategories"), v.null())),
  organizationId: v.string(),
}).searchIndex("by_search", {
  searchField: "name",
});
