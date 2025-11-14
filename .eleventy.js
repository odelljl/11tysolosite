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
