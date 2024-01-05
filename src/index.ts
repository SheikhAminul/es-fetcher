import { useEffect, useState } from 'react'
import { chooseProperties, constructAbsoluteUrl, isAbsoluteUrl, omitProperties, tryParsingBody } from './utils'
import { clearMemoryCache, deleteMemoryCache, deleteMemoryCaches, memoryCacheData } from './fetch-memory-cache'

/**
 * Options for API requests made with es-fetch.
 *
 * @interface FetchOptions
 */
interface FetchOptions {
    body?: BodyInit | null
    cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload' | 'memory-cache'
    credentials?: 'include' | 'omit' | 'same-origin'
    headers?: [string, string][] | Record<string, string> | Headers
    integrity?: string
    keepalive?: boolean
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT'
    mode?: 'cors' | 'navigate' | 'no-cors' | 'same-origin'
    redirect?: 'error' | 'follow' | 'manual'
    referrer?: string
    referrerPolicy?: ReferrerPolicy
}

/**
 * Configuration options for the es-fetch package.
 *
 * @interface FetchConfiguration
 */
interface FetchConfiguration {
    baseUrl?: string
    accessToken?: string
    authMethod?: 'bearer'
    cache?: FetchOptions['cache']
    credentials?: FetchOptions['credentials']
    headers?: FetchOptions['headers']
    mode?: FetchOptions['mode']
}

/**
 * Global configuration fetch.
 *
 * @type {FetchConfiguration}
 */
export let configuration: FetchConfiguration = { baseUrl: window.location.origin }

/**
 * Configures the global fetch settings.
 *
 * @param {FetchConfiguration} fetchConfiguration - Global fetch settings, as defined in the `FetchConfiguration` interface.
 */
const configureFetcher = (fetchConfiguration: FetchConfiguration) => {
    configuration = { ...configuration, ...fetchConfiguration }
}

/**
 * Create an absolute URL based on the base URL and provided URL.
 *
 * @param {string} url - Relative or absolute URL.
 * @param {string} [base] - Optional base URL.
 * @returns {string} - The absolute URL.
 */
const createAbsoluteUrl = (url: string, base?: string): string => constructAbsoluteUrl(url, base || configuration.baseUrl)

/**
 * Makes fetch request using the provided URL and options and returns the fetched data.
 *
 * @param {string} url - The URL to fetch data from. It can be either an absolute or relative URL.
 * @param {FetchOptions} [options] - Custom options for the fetch request, as defined in the `FetchOptions` interface.
 * @returns {Promise<any>} - A promise that resolves with the fetched data.
 */
export const fetchData = (url: string, options: FetchOptions = {}): Promise<any> => new Promise((onSuccess, onFailed) => {
    if (!isAbsoluteUrl(url)) url = createAbsoluteUrl(url)

    let { baseUrl, cache } = configuration
    if (options.cache) {
        cache = options.cache
        if (cache === 'memory-cache') options = omitProperties(options, ['cache'])
    }

    let cachedData: any, cacheable = cache === 'memory-cache' && (!options.method || options.method === 'GET')
    if (cacheable && (cachedData = memoryCacheData[url])) onSuccess(cachedData)
    else if (baseUrl && url.startsWith(baseUrl)) {
        const { accessToken, authMethod, headers } = configuration
        options = {
            ...(cache && cache !== 'memory-cache' ? { cache } : {}),
            ...(chooseProperties(configuration, ['mode', 'credentials'])),
            ...options,
            headers: {
                ...(options.body ? (headers || {}) : omitProperties(headers || {} as any, ['Content-Type'])),
                ...(options.headers || {})
            }
        }
        if (authMethod === 'bearer' && accessToken) (<any>options.headers)['Authorization'] = `Bearer ${accessToken}`
    }

    fetch(url, options as any).then(async (fetchResults) => {
        const body = await tryParsingBody(fetchResults).catch(() => { })
        if (cacheable) memoryCacheData[url] = body
        if (fetchResults.ok) onSuccess(body)
        else onFailed(body)
    }).catch(exception => {
        onFailed(exception)
    })
})

/**
 * A custom React hook for making API requests and managing loading state.
 *
 * @param {string} url - The URL to fetch data from. It can be either an absolute or relative URL.
 * @param {FetchOptions} [options] - Custom options for the fetch request, as defined in the FetchOptions interface.
 * @returns {{ loading: boolean, fetchedData: any, error?: string }} - An object containing loading state, data, and error.
 */
const useFetch = (url: string, options?: FetchOptions): { loading: boolean; fetchedData: any; error?: string } => {
    const [loading, setLoading] = useState(true)
    const [fetchedData, setFetchedData] = useState<any>()
    const [error, setError] = useState<string>()

    useEffect(() => {
        fetchData(url, options).then((fetchData) => {
            setFetchedData(fetchData)
            setLoading(false)
        }).catch((error) => {
            setError(error.message)
            setLoading(false)
        })
    }, [url, options])

    return { loading, fetchedData, error }
}

export { fetchData as fetch, useFetch, configureFetcher, deleteMemoryCache, deleteMemoryCaches, clearMemoryCache, createAbsoluteUrl, FetchOptions }