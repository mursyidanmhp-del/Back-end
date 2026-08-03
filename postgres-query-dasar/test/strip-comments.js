function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/--.*$/gm, "");
}

module.exports = { stripComments };
