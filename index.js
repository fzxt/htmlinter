const unified = require('unified');
const parse = require('rehype-parse');
const stringify = require('rehype-stringify');
const rule = require('./rules/multiple-attrs-new-line');
var report = require('vfile-reporter');

const t1 = `
<html>
  <body class="attr" some-other-thing="thing"
  final-thing="ye" yo="ya">
  </body>
</html
`

module.exports = unified()
  .use(parse, { emitParseErrors: false, verbose: true })
  .use(rule)
  .use(stringify)
  .process(t1, function(err, file) {
      console.log(report(file));
  });
