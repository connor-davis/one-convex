import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  imageId: v.string(),
  name: v.string(),
  description: v.string(),
  points: v.number(),
  categoryId: v.optional(v.id("badgeCategories")),
  organizationId: v.string(),
}).searchIndex("by_search", {
  searchField: "name",
});
