/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as badges_badgeCategories from "../badges/badgeCategories.js";
import type * as badges_badges from "../badges/badges.js";
import type * as badges_generateUploadUrl from "../badges/generateUploadUrl.js";
import type * as schemas_badgeCategories from "../schemas/badgeCategories.js";
import type * as schemas_badges from "../schemas/badges.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "badges/badgeCategories": typeof badges_badgeCategories;
  "badges/badges": typeof badges_badges;
  "badges/generateUploadUrl": typeof badges_generateUploadUrl;
  "schemas/badgeCategories": typeof schemas_badgeCategories;
  "schemas/badges": typeof schemas_badges;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
