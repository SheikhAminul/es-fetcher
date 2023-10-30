/**
 * Omit properties from an object.
 *
 * @param {object} item - The input object.
 * @param {string[]} keys - An array of keys to omit from the object.
 * @returns {{ [key: string]: any }} - A new object with the specified keys omitted.
 */
const omitProperties = <T extends Record<string, any>>(item: T, keys: (keyof T)[]): Partial<T> => {
    return Object.fromEntries(Object.entries(item).filter(([key]) => !keys.includes(key as keyof T))) as Partial<T>
}

/**
 * Choose properties from an object.
 *
 * @param {object} item - The input object.
 * @param {string[]} keys - An array of keys to choose from the object.
 * @returns {{ [key: string]: any }} - A new object with only the specified keys.
 */
const chooseProperties = <T extends Record<string, any>>(item: T, keys: (keyof T)[]): Partial<T> => {
    return Object.fromEntries(Object.entries(item).filter(([key]) => keys.includes(key as keyof T))) as Partial<T>
}

/**
 * Check if a URL is absolute.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} - True if the URL is absolute, false otherwise.
 */
const isAbsoluteUrl = (url: string): boolean => {
    return url.match(/^[^:\/\\]+:\/\//) ? true : false;
}

/**
 * Construct an absolute URL from a relative URL and an optional base.
 *
 * @param {string} url - The relative URL.
 * @param {string} [base] - The optional base URL.
 * @returns {string} - The absolute URL.
 */
const constructAbsoluteUrl = (url: string, base?: string): string => {
    base = (base || window.location.origin).replace(/\/+$/, '')
    url = url.replace(/^\/+/, '')
    return `${base}/${url}`
}

/**
 * Try parsing the response body based on the content type.
 *
 * @param {Response} res - The response object.
 * @returns {Promise<any>} - A promise that resolves to the parsed response body.
 * @throws {Error} - Throws an error if parsing fails.
 */
const tryParsingBody = async (res: Response): Promise<any> => {
    try {
        const contentType = res.headers.get('Content-Type')
        if (!contentType) return await res.blob()
        else if (contentType.includes('application/json')) {
            return await res.json()
        } else if (contentType.includes('application/xml') || contentType.includes('text/xml')) {
            return (new DOMParser()).parseFromString(await res.text(), 'application/xml')
        } else if (contentType.includes('text/')) {
            return await res.text()
        } else {
            return await res.blob()
        }
    } catch (error) {
        throw error
    }
}

export { omitProperties, chooseProperties, isAbsoluteUrl, constructAbsoluteUrl, tryParsingBody }