/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://aara.site',   // your domain
  generateRobotsTxt: true,        // creates robots.txt
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*'], // exclude private routes
};
