import { filter, pipe } from "ramda";
import { getProductVariants } from "./productAPIs";
import { isNonHiddenVariant } from "./variantAPIs";

// Product non-hidden variants
const getNonHiddenVariants = filter(isNonHiddenVariant)
export const getProductNonHiddenVariants = pipe(getProductVariants, getNonHiddenVariants)