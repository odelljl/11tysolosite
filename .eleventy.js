module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets');

  // Custom collection: posts ordered by Markdown file name descending
  eleventyConfig.addCollection('postsByFileNameDesc', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('posts/*.md')
      .sort((a, b) =>
        b.fileSlug.localeCompare(a.fileSlug, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      );
  });

  // Configure Markdown to open external links in a new tab/window
  // and add security-related rel attributes.
  const markdownIt = require('markdown-it');
  const md = markdownIt({ html: true, linkify: true });

  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const hrefIndex = tokens[idx].attrIndex('href');
    const href = hrefIndex >= 0 ? tokens[idx].attrs[hrefIndex][1] : '';
    const isExternal = /^https?:\/\//i.test(href);

    if (isExternal) {
      // target="_blank"
      const targetIndex = tokens[idx].attrIndex('target');
      if (targetIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']);
      } else {
        tokens[idx].attrs[targetIndex][1] = '_blank';
      }

      // rel="noopener noreferrer"
      const relIndex = tokens[idx].attrIndex('rel');
      if (relIndex < 0) {
        tokens[idx].attrPush(['rel', 'noopener noreferrer']);
      } else {
        tokens[idx].attrs[relIndex][1] = 'noopener noreferrer';
      }
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary('md', md);

  // LiquidJS settings:
  // 1) Disable automatic HTML escaping so trusted content (like rendered Markdown)
  //    can be output without being escaped.
  // 2) Provide a noop 'safe' filter so templates using `| safe` won't error.
  eleventyConfig.setLiquidOptions({
    outputEscape: (s) => s,
  });
  eleventyConfig.addLiquidFilter('safe', (value) => value);

  return {
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    templateFormats: ['md', 'liquid'],
  };
};
