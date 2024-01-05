es-fetcher: Simplify API integration and content fetching in front-end applications.<br/>
[![NPM Version](https://img.shields.io/npm/v/es-fetcher.svg?branch=main)](https://www.npmjs.com/package/es-fetcher)
[![Publish Size](https://badgen.net/packagephobia/publish/es-fetcher)](https://packagephobia.now.sh/result?p=es-fetcher)
[![Downloads](https://img.shields.io/npm/dt/es-fetcher)](https://www.npmjs.com/package/es-fetcher)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SheikhAminul/es-fetcher/blob/main/LICENSE)
================

es-fetcher is a versatile and lightweight JavaScript library that simplifies API integration and data fetching in front-end applications, making it faster and more efficient than ever before. With a set of utility functions and configuration options, this package streamlines your API requests, caching, and error handling.
 
##  Table of Contents
*   [Features](#features)
*   [Install](#install)
*   [Usage](#usage)
*   [API Reference](#API_Reference)
*   [Contributing](#contributing)
*   [License](#license)
*   [Author](#author)

##  Features
*   **Effortless API Integration:** With es-fetcher, you can easily integrate external APIs into your front-end application, saving you time and effort.
*   **React Hook:** Simplify data fetching and state management in your React application with the **`useFetch`** hook.
*   **Flexible Configuration:** Configure the fetcher to match your application's specific requirements, including base URLs, access tokens, authentication methods, headers, and more.
*   **Automatic Data Parsing:** es-fetcher automatically parses response data based on the content type, supporting JSON, XML, Blob, and text.
*   **Memory Caching:** Improve performance and reduce redundant API calls by caching responses in memory with the ability to easily clear the entire memory cache or delete specific cached data by URL or URL patterns.
*   **Community-Driven:** es-fetcher is open-source, and we welcome contributions from the community. Join us in making it even better!

##  Install
```plaintext
npm i es-fetcher
```


##  Usage

### Fetch (API calls) with authentication
A minimal example of fetching with authentication.

```typescript
import { fetch, configureFetcher } from 'es-fetcher'

// Configure API access token, base URL, authentication method, and more
configureFetcher({
    baseUrl: 'https://api.example.com/dev/',
    accessToken: 'your-access-token',
    authMethod: 'bearer',
	headers: { 'Content-Type': 'application/json' }
})

// Fetch in GET method example
const users = await fetch('/users')

// Fetch from cache instead of making API call (GET only) example
const countries = await fetch('/utils/countries', { cache: 'memory-cache' })

// Basic POST example
const result = await fetch('/customer/add', {
    method: 'POST',
    body: JSON.stringify({
        name: 'John Doe',
        age: 30
    })
})
```

### React integration (useFetch hook)

Data fetching and state management in your React application with the **`useFetch`** hook.
```typescript
import { useFetch } from 'es-fetcher'

function UserList() {
    const { data, loading, error } = useFetch('/users')

    if (loading) return <p>Loading...</p>

    if (error) return <p>Error!</p>

    return (
        <ul>
            {data.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}  
        </ul>
    )
}
```

Example of using memory-cache for GET requests. If a cache is not available for the URL, it will fetch and cache the data. Upon subsequent requests or renders, it will return the cached data.
```typescript
import { useFetch } from 'es-fetcher'

function UserList() {
    const { data, loading, error } = useFetch('/users', { cache: 'memory-cache' })

    if (loading) return <p>Loading...</p>

    if (error) return <p>Error!</p>

    return (
        <ul>
            {data.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}  
        </ul>
    )
}
```

##  API Reference

### **Core:**

### **`configureFetcher(configuration: FetchConfiguration)`**
Use the `configureFetcher` function to configure the global fetch settings. This function allows you to set various options that will apply to all subsequent fetch requests for the supplied base URL.

Parameters:
*   `configuration` (`FetchConfiguration`): Global fetch settings, as defined in the `FetchConfiguration` interface.

Example:
```typescript
import { configureFetcher } from 'es-fetcher'

configureFetcher({
    baseUrl: 'https://api.example.com',
    accessToken: 'your-access-token',
    cache: 'no-store',
    credentials: 'include',
    headers: {
        'Accept': 'application/json'
    },
    mode: 'cors'
})
```

### **`useFetch(url: string, options?: FetchOptions)`**
`useFetch` is a custom React Hook provided by es-fetcher for data fetching in functional components. It simplifies the process of making fetch requests and managing the state of your component.

Parameters:
*   `url` (string): The URL to fetch data from. It can be either an absolute or relative URL.
*   `options` (`FetchOptions`, optional): Custom options for the fetch request, as defined in the `FetchOptions` interface.

Return Values:
*   `loading` (boolean): A boolean value indicating whether the request is in progress.
*   `fetchedData` (any): The fetched data if the request is successful.
*   `error` (string): An error message if the request fails.

Example:
```typescript
const { loading, fetchedData, error } = useFetch('/api/users', { cache: 'memory-cache' })
```

### **`fetch(url: string, options?: FetchOptions)`**
The `fetch` function makes fetch request using the provided URL and options and returns the fetched data. This function handles various HTTP methods, caching, and other configurations.

Parameters:
*   `url` (string): The URL to make the API request to.
*   `options` (`FetchOptions`, optional): Optional request options that override the global configuration for this specific request.

Return Values:
*   `fetchedData` (any): The fetched data if the request is successful.

Example:
```typescript
const countries = await fetch('/utils/countries', { 
    cache: 'memory-cache',
    headers: {
        'Accept': 'application/json'
    }
})
```

### **Caching:**

### **`clearMemoryCache()`**
The `clearMemoryCache` function clears the entire memory cache.

### **`deleteMemoryCache(urlPattern: string)`**
The `deleteMemoryCache` function is used to clear cached responses from the memory cache for a specific URL pattern. It allows you to selectively remove cached data for a single URL or a specific URL pattern.

Parameters:
*   `urlPattern` (string): The URL pattern for which you want to clear cached data. This pattern can include wildcards (*) to match multiple URLs.

Example:
```typescript
import { deleteMemoryCache } from 'es-fetcher'

// Delete cached data for specific URLs
deleteMemoryCache('https://example.com/user/me')
deleteMemoryCache('/user/me')

// Delete cached data for all URLs that match a pattern
deleteMemoryCache('https://example.com/*') // Deletes for all URLs in this site
deleteMemoryCache('/user/*')
```

### **`deleteMemoryCaches(urlPatterns: string[])`**
The `deleteMemoryCaches` function functions similarly to `deleteMemoryCache`, but it accepts multiple URL patterns in the form of an array.

Parameters:
*   `urlPatterns` (string[]): The URL patterns for which you want to clear cached data.

Example:
```typescript
import { deleteMemoryCaches } from 'es-fetcher'

deleteMemoryCaches([
    '/user/*',
    '/me/follower/*',
    'https://api.example.com/user/me'
])
```

### **Interfaces:**

### **`FetchConfiguration`**
The `FetchConfiguration` interface defines the global fetch settings.
- `baseUrl` (string, optional): The base URL for API requests. Defaults to `window.location.origin`.

- `accessToken` (string, optional): An access token to include in the request headers for authentication.

- `authMethod` (string, optional): The authentication method to use. Currently supports only 'bearer' for Bearer Token authentication.

- `cache` (string, optional): The caching strategy to use. Options include:
  - `'default'` (default): Use the browser's default caching behavior.
  - `'force-cache'`: Always use the cached response.
  - `'no-cache'`: Bypass the cache and make a request to the server.
  - `'no-store'`: Bypass the cache completely.
  - `'only-if-cached'`: Use a cached response if available; otherwise, make a request.
  - `'reload'`: Bypass the cache and request the server for a new response.
  - `'memory-cache'`: Enable in-memory caching for GET requests.

- `credentials` (string, optional): The credentials mode for the request. Options include:
  - `'include'`: Include credentials (e.g., cookies) in the request.
  - `'omit'`: Omit credentials from the request.
  - `'same-origin'` (default): Include credentials only if the request is on the same origin.

- `headers` (array, object, or Headers, optional): Custom headers to include in the request.

- `mode` (string, optional): The mode of the request. Options include:
  - `'cors'` (default): Make a cross-origin request with CORS headers.
  - `'navigate'`: Make a navigation request (e.g., for page reload).
  - `'no-cors'`: Make a no-cors request, limited to same-origin requests.
  - `'same-origin'`: Make a same-origin request.

### **`FetchOptions`**
The `FetchOptions` interface defines custom settings that you can apply to fetch call.
- `body` (BodyInit | null, optional): The request body data. It can be a string, FormData, Blob, ArrayBufferView, or null.

- `cache` (string, optional): The caching strategy for the request. Options are the same as in `FetchConfiguration.cache`.

- `credentials` (string, optional): The credentials mode for the request. Options are the same as in `FetchConfiguration.credentials`.

- `headers` (array, object, or Headers, optional): Custom headers to include in the request. These headers are merged with the global configuration headers.

- `integrity` (string, optional): Subresource integrity value to ensure the fetched resource has not been tampered with.

- `keepalive` (boolean, optional): Whether to keep the request alive after the page is unloaded.

- `method` (string, optional): The HTTP method for the request. Options include 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', and 'CONNECT'.

- `mode` (string, optional): The mode of the request. Options are the same as in `FetchConfiguration.mode`.

- `redirect` (string, optional): The redirect behavior for the request. Options include 'error', 'follow', and 'manual'.

- `referrer` (string, optional): The referrer URL for the request.

- `referrerPolicy` (string, optional): The referrer policy for the request. For example, 'no-referrer', 'no-referrer-when-downgrade', or 'same-origin'.

## Contributing

You are welcome to contribute! If you are adding a feature or fixing a bug, please contribute to the [GitHub repository](https://github.com/SheikhAminul/es-fetcher/).


## License

es-fetcher is licensed under the [MIT license](https://github.com/SheikhAminul/es-fetcher/blob/main/LICENSE).


## Author

|[![@SheikhAminul](https://avatars.githubusercontent.com/u/25372039?v=4&s=96)](https://github.com/SheikhAminul)|
|:---:|
|[@SheikhAminul](https://github.com/SheikhAminul)|