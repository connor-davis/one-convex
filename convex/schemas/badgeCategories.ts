import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  name: v.string(),
  organizationId: v.string(),
}).searchIndex("by_search", {
  searchField: "name",
});
