// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../Helpers'

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl(),
        credentials: 'include', // important for cookies
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({}),
})