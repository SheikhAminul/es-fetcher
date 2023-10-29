const omitProperties = (item: { [key: string]: any }, keys: string[]) => {
    return Object.fromEntries(Object.entries(item).filter(([key]) => !keys.includes(key)))
}

const isAbsoluteUrl = (url: string) => {
    return url.match(/^[^:\/\\]+:\/\//) ? true : false;
}

const constructAbsoluteUrl = (url: string, base?: string) => {
    base = (base || window.location.origin).replace(/\/+$/, '')
    url = url.replace(/^\/+/, '')
    return `${base}/${url}`
}

const tryParsingBody = async (res: Response) => {
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

export { omitProperties, isAbsoluteUrl, constructAbsoluteUrl, tryParsingBody }