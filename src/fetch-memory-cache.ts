import { createAbsoluteUrl } from './index'
import { isAbsoluteUrl } from './utils'

/**
 * In-memory cache for storing fetched data.
 * @type {Object.<string, any>}
 */
let cacheData: { [url: string]: any } = {}

/**
 * Delete cached data based on a URL pattern.
 *
 * @param {string} urlPattern - The URL pattern for which you want to clear cached data. This pattern can include wildcards (*) to match multiple URLs.
 */
const deleteMemoryCache = (urlPattern: string) => {
    urlPattern = new (<any>window).URLPattern(isAbsoluteUrl(urlPattern) ? urlPattern : createAbsoluteUrl(urlPattern))
    for (const url of Object.keys(cacheData)) {
        if ((urlPattern as any).test(url)) {
            delete cacheData[url]
        }
    }
}

/**
 * Delete cached data based on an array of URL patterns.
 *
 * @param {string[]} urlPatterns - An array of URL patterns to match for cache deletion.
 */
const deleteMemoryCaches = (urlPatterns: string[]) => {
    for (const urlPattern of urlPatterns) {
        deleteMemoryCache(urlPattern)
    }
}

/**
 * Clear the entire in-memory cache.
 */
const clearMemoryCache = () => {
    cacheData = {}
}

export { cacheData as memoryCacheData, deleteMemoryCache, deleteMemoryCaches, clearMemoryCache }