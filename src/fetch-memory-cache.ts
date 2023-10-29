import { createAbsoluteUrl } from './index'
import { isAbsoluteUrl } from './utils'

let cacheData: { [url: string]: any } = {}

const deleteMemoryCache = (urlPattern: string) => {
    urlPattern = new (<any>window).URLPattern(isAbsoluteUrl(urlPattern) ? urlPattern : createAbsoluteUrl(urlPattern))
    for (const url of Object.keys(cacheData)) {
        if ((urlPattern as any).test(url)) {
            delete cacheData[url]
        }
    }
}

const deleteMemoryCaches = (urlPatterns: string[]) => {
    for (const urlPattern of urlPatterns) {
        deleteMemoryCache(urlPattern)
    }
}

const clearMemoryCache = () => {
    cacheData = {}
}

export { cacheData as memoryCacheData, deleteMemoryCache, deleteMemoryCaches, clearMemoryCache }