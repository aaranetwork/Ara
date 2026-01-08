/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://aara.ai',   // Your live domain
  generateRobotsTxt: true,      // Generates /robots.txt automatically
  sitemapSize: 7000,            // Max URLs per sitemap file
  changefreq: 'daily',
  priority: 0.7,
  trailingSlash: false,

  // Exclude private, user-only, and backend routes
  exclude: [
    '/api/*',
    '/admin/*',
    '/profile',
    '/journal',
    '/chat',
    '/therapists/results',
    '/welcome',
  ],

  // Optional: Add additional paths manually if needed
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/about'),
    await config.transform(config, '/contact'),
    await config.transform(config, '/plans'),
    await config.transform(config, '/privacy'),
    await config.transform(config, '/terms'),
    await config.transform(config, '/therapists'),
    await config.transform(config, '/growth'),
  ],

  // Transform each URL (advanced control)
  transform: async (config, path) => {
    return {
      loc: path,                    // URL
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  // Robots.txt rules
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api',
          '/admin',
          '/profile',
          '/journal',
          '/chat',
          '/therapists/results',
          '/welcome',
        ],
      },
    ],
  },
};
