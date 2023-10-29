import { useEffect, useState } from 'react'
import { constructAbsoluteUrl, isAbsoluteUrl, omitProperties, tryParsingBody } from './utils'
import { clearMemoryCache, deleteMemoryCache, deleteMemoryCaches, memoryCacheData } from './fetch-memory-cache'

interface FetchConfiguration {
    baseUrl?: string
    accessToken?: string
    authMethod?: 'bearer'
    cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload' | 'memory-cache'
    credentials?: 'include' | 'omit' | 'same-origin'
    headers?: [string, string][] | Record<string, string> | Headers
    mode?: 'cors' | 'navigate' | 'no-cors' | 'same-origin'
}

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

export let configuration: FetchConfiguration = { baseUrl: window.location.origin }
const configureFetcher = (fetchConfiguration: FetchConfiguration) => {
    configuration = { ...configuration, ...fetchConfiguration }
}

const createAbsoluteUrl = (url: string, base?: string) => constructAbsoluteUrl(url, base || configuration.baseUrl)

export const fetchData = async (url: string, options: FetchOptions = {}) => {
    if (!isAbsoluteUrl(url)) url = createAbsoluteUrl(url)

    const { baseUrl, cache } = configuration

    let cachedData: any, cacheable = cache === 'memory-cache' && (!options.method || options.method === 'GET')
    if (cacheable && (cachedData === memoryCacheData[url])) {
        return cachedData
    }

    if (baseUrl && url.startsWith(baseUrl)) {
        const { accessToken, authMethod, credentials, headers, mode } = configuration
        options = {
            ...(cache && cache !== 'memory-cache' ? { cache } : {}),
            ...(credentials ? { credentials } : {}),
            ...(mode ? { mode } : {}),
            ...options,
            headers: {
                ...(options.body ? (headers || {}) : omitProperties(headers || {}, ['Content-Type'])),
                ...(options.headers || {})
            }
        }
        if (authMethod === 'bearer' && accessToken) (<any>options.headers)['Authorization'] = `Bearer ${accessToken}`
    }

    const res = await fetch(url, options as any)
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
    const body = await tryParsingBody(res)
    if (cacheable) memoryCacheData[url] = body

    return body
}

const useFetch = (url: string, options?: FetchOptions) => {
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

export { fetchData as fetch, useFetch, configureFetcher, deleteMemoryCache, deleteMemoryCaches, clearMemoryCache, createAbsoluteUrl }