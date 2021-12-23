import { prop } from "ramda";

export const getProductTitle = prop('title')
export const getProductVariants = prop('variants')
const getProductStatus = prop('status')