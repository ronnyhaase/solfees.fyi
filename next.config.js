/** @type {import('next').NextConfig} */

const { withPlausibleProxy } = require("next-plausible")

const nextConfig = {}

module.exports = withPlausibleProxy()(nextConfig)
