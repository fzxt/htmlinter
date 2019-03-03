const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");

module.exports = rule(
  "htmllint:multiple-attrs-new-line",
  multipleClassesNewline
);

function multipleClassesNewline(tree, file) {
  visit(tree, "element", visitor);

  function visitor(node) {
    node.children.forEach(visitElement);
  }

  function visitElement(element) {
    if (element.data) {
      const position = element.data.position;
      const numAttributes = Object.keys(position.properties).length;

      if (numAttributes > 1) {
        checkAttrsSameLine(position, file);
        checkElementAttrSameLine(position, file);
      }
    }
  }

  function checkAttrsSameLine(position, file) {
    const visitedLines = {};
    for (property in position.properties) {
      const propertyInfo = position.properties[property];
      if (visitedLines[propertyInfo.start.line]) {
        const reason =
          "Only 1 attribute per line is allowed with multiple attrs";

        file.message(reason, {
          line: propertyInfo.start.line,
          column: propertyInfo.start.column
        });

        return;
      }

      visitedLines[propertyInfo.start.line] = true;
    }
  }

  function checkElementAttrSameLine(position, file) {
    for (property in position.properties) {
      const propertyInfo = position.properties[property];
      if (propertyInfo.start.line === position.opening.start.line) {
        const reason =
          "Found " +
          property +
          " on the same line as element tag with multiple attrs. Move to a new line";

        file.message(reason, {
          line: propertyInfo.start.line,
          column: propertyInfo.start.column
        });
      }
    }
  }
}
