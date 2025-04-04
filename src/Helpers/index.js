const getBaseUrl = () => {
    return import.meta.env.VITE_APP_API_URL || "http://localhost:3000";
}
export { getBaseUrl }