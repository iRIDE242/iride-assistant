import { add, filter, pipe, prop, reduce } from "ramda";
import { getVariantLocationInventory } from "../utils/api";
import { LOCAL_LOCATION_ID } from "../utils/config";
import { getProductVariants } from "./productAPIs";
import { getVariantInventoryItemId, isNonHiddenVariant } from "./variantAPIs";

/**
 * Shared properties
 */
export const getTitle = prop('title')


// Product non-hidden variants
