import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL

export { SERVER_BASE_URL }
