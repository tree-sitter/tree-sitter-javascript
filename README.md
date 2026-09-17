# tree-sitter-javascript

[![CI][ci]](https://github.com/tree-sitter/tree-sitter-javascript/actions/workflows/ci.yml)
[![discord][discord]](https://discord.gg/w7nTvsVJhm)
[![matrix][matrix]](https://matrix.to/#/#tree-sitter-chat:matrix.org)
[![crates][crates]](https://crates.io/crates/tree-sitter-javascript)
[![npm][npm]](https://www.npmjs.com/package/tree-sitter-javascript)
[![pypi][pypi]](https://pypi.org/project/tree-sitter-javascript)

JavaScript and JSX grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

This grammar intends to be a close approximation of the [ECMAScript](https://ecma-international.org/publications-and-standards/standards/ecma-262/)
specification, with some extensions to support JSX syntax. We try to support the
latest version of the spec, though it is possible that some very new features may
not be supported yet.

References

- [The ESTree Spec](https://github.com/estree/estree)
- [The ECMAScript 2025 Spec](https://tc39.es/ecma262/2025/)

## Developing the ESM prototype

Use matching prototype checkouts of `tree-sitter` and `tree-sitter-javascript`
as sibling directories. Node.js, npm, Rust/Cargo, and a C/C++ toolchain are
required. The local CLI package supplies `tree-sitter-cli/dsl.d.ts`; generation
uses the core checkout's native runtime, not the released npm CLI.

```sh
npm ci --ignore-scripts
npm rebuild node-addon-api node-gyp-build tree-sitter
npm run lint
npm run generate
npm rebuild tree-sitter-javascript
npm run test:corpus
npm test
```

The source is `grammar.mjs`; the root package and Node bindings remain CommonJS.
`npm run tree-sitter -- --help` builds and runs the prototype CLI with Cargo.
Set `TREE_SITTER_DIR` to an absolute core checkout path when it is not a sibling.
This changes the Cargo wrapper only: npm's local dependencies still require the
sibling layout (including in CI). Do not replace the portable relative paths in
`package.json` or `package-lock.json` with machine-specific paths.

Hosted workflows still use the release setup actions. They need matching
prototype sibling checkouts and the Cargo wrapper before they can generate or
install this prototype; the local commands above are the validation path.

[ci]: https://img.shields.io/github/actions/workflow/status/tree-sitter/tree-sitter-javascript/ci.yml?logo=github&label=CI
[discord]: https://img.shields.io/discord/1063097320771698699?logo=discord&label=discord
[matrix]: https://img.shields.io/matrix/tree-sitter-chat%3Amatrix.org?logo=matrix&label=matrix
[npm]: https://img.shields.io/npm/v/tree-sitter-javascript?logo=npm
[crates]: https://img.shields.io/crates/v/tree-sitter-javascript?logo=rust
[pypi]: https://img.shields.io/pypi/v/tree-sitter-javascript?logo=pypi&logoColor=ffd242
