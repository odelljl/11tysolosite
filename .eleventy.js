module.exports = function (eleventyConfig) {
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
