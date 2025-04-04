const getBaseUrl = () => {
    return import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
}
export { getBaseUrl }