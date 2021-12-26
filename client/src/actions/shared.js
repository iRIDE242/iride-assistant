import { filter, prop } from "ramda";
import { areLocalNonHiddensOutOfStock, isActive } from "./productAPIs";

/**
 * Shared properties
 */
export const getTitle = prop('title')




/**
 * API requests
 */

/**
 * Get products that are active and locally out of stock
 * @param {Array} products 
 * @returns {Array}
 */
export const getLocallyOutOfStockProducts = async products => {
  const activeProducts = filter(isActive)(products)

  const activeLocallyOutOfStockProducts = []

  for (let index = 0; index < activeProducts.length; index++) {
    if (await areLocalNonHiddensOutOfStock(activeProducts[index])) activeLocallyOutOfStockProducts.push(activeProducts[index])
  }

  return activeLocallyOutOfStockProducts
}
