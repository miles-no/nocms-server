import request from 'superagent';

let hasSitemapXml = false;

const defaultLocFormatter = ({ uri }) => {
  return uri;
};

const defaultLastmodFormatter = ({ lastModified }) => {
  return lastModified;
};

const defaultPriorityFormatter = () => {
  return '0.5';
};

const defaultChangeFreqFormatter = () => {
  return 'weekly';
};

const defaultFormatters = {
  loc: defaultLocFormatter,
  lastmod: defaultLastmodFormatter,
  priority: defaultPriorityFormatter,
  changefreq: defaultChangeFreqFormatter,
};

let customFormatters;

const createUrlXml = (data, req) => {
  const formatters = Object.assign({}, defaultFormatters, customFormatters);

  return `  <url>
    <loc>${formatters.loc(data, req)}</loc>
    <lastmod>${formatters.lastmod(data, req)}</lastmod>
    <changefreq>${formatters.changefreq(data, req)}</changefreq>
    <priority>${formatters.priority(data, req)}</priority>
  </url>`;
};

const createXml = (urls, req) => {
  const urlXml = urls.map((data) => {
    return createUrlXml(data, req);
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlXml}
</urlset>`;
};

const api = {
  addSitemapXml: (formatters = {}) => {
    hasSitemapXml = true;
    customFormatters = formatters;
  },
  middleware: (config) => {
    return (req, res) => {
      if (!hasSitemapXml) {
        res.status(404).end();
        return;
      }

      request
        .get(`${config.pageService}/sitemap`)
        .end((err, sitemapResult) => {
          if (err) {
            res.status(500).end();
            return;
          }

          const xml = createXml(sitemapResult.body, req);
          res
            .append('Content-Type', 'application/xml')
            .status(200)
            .send(xml);
        });
    };
  },
};

export default api;
