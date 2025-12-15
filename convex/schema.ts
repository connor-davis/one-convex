import { defineSchema } from "convex/server";
import badges from "./schemas/badges";
import badgeCategories from "./schemas/badgeCategories";

export default defineSchema({
  badges: badges,
  badgeCategories: badgeCategories,
});
