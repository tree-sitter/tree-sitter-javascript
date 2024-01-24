try {
  module.exports = require("../../build/Release/tree_sitter_javascript_binding");
} catch (error1) {
  if (error1.code !== 'MODULE_NOT_FOUND') {
    throw error1;
  }
  try {
    module.exports = require("../../build/Debug/tree_sitter_javascript_binding");
  } catch (error2) {
    if (error2.code !== 'MODULE_NOT_FOUND') {
      throw error2;
    }
    throw error1
  }
}

try {
  module.exports.javascript.nodeTypeInfo = require("../../javascript/src/node-types.json");
  module.exports.jsx.nodeTypeInfo = require("../../jsx/src/node-types.json");
} catch (_) {}
