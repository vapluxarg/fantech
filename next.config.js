/**
 * Next.js configuration to support static export for GitHub Pages.
 */
module.exports = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Hostinger sirve el sitio en la raíz (fantecharg.com),
  // así que no necesitamos basePath personalizado.
  basePath: '',
};
