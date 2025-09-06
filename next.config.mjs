import bundleAnalyzer from '@next/bundle-analyzer';
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = bundleAnalyzer ({
    enabled:process.env.bundleAnalyzer === 'true',
});
const nextConfig = {
};

export default withBundleAnalyzer(nextConfig);
