const unified = require("unified");
const parse = require("rehype-parse");
const stringify = require("rehype-stringify");
const rule = require("../rules/multiple-attrs-new-line");
const report = require("vfile-reporter");

const processor = unified()
  .use(parse, { emitParseErrors: false, verbose: true })
  .use(rule)
  .use(stringify);

test("enforces 1 attr per line if more than one attr on a tag", () => {
  const template = `
    <html>
      <body class="attr" some-other-thing="thing"></body>
    </html
  `;

  processor.process(template, (err, file) => {
    const expectedReason =
      "Only 1 attribute per line is allowed with multiple attrs";

    const messages = file.messages
      .map(String)
      .filter(message => message.includes(expectedReason));

    expect(messages.length).toBe(1);
  });
});

test("enforces attrs on different line than element if more than one attr on a tag", () => {
  // TODO: this test isnt as complete as it should be..
  const template = `
    <html>
      <body class="attr" some-other-thing="thing"></body>
    </html
  `;

  processor.process(template, (err, file) => {
    const expectedReason =
      "Found className on the same line as element tag with multiple attrs. Move to a new line";

    const messages = file.messages
      .map(String)
      .filter(message => message.includes(expectedReason));

    expect(messages.length).toBe(1);
  });
});

test("reports no error if no issues (single attr)", () => {
  const template = `
    <html>
      <body class="attr"></body>
    </html
  `;

  processor.process(template, (err, file) => {
    expect(file.messages.map(String).length).toBe(0);
  });
});

test("reports no error if no issues (each attr on new line)", () => {
  const template = `
    <html>
      <body
        class="attr"
        some-other-thing="thing">
      </body>
    </html
  `;

  processor.process(template, (err, file) => {
    expect(file.messages.map(String).length).toBe(0);
  });
});
