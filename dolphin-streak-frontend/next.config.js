/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ['test.com', 'test.com.png', 'static.vecteezy.com', 'tse4.mm.bing.net', 'www.worldatlas.com', 'example.com', 'joken2.webp','res.cloudinary.com', "placehold.co"], // Add the correct hostname here
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/all',
  //       permanent: false,
  //     },
  //   ];
  // },
  /** We run eslint as a separate task in CI */
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
  },
};

module.exports = config;
