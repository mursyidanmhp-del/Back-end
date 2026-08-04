function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments (JS & SQL)
    .replace(/--.*$/gm, "") // SQL line comments
    .replace(/\/\/.*$/gm, ""); // JS line comments
}

module.exports = { stripComments };
