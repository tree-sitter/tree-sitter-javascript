// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterJS",
    products: [
        .library(name: "TreeSitterJS", targets: ["TreeSitterJS"]),
    ],
    dependencies: [],
    targets: [
        .target(name: "TreeSitterJS",
                path: ".",
                exclude: [
                    "binding.gyp",
                    "bindings",
                    "Cargo.toml",
                    "test",
                    "common/define-grammar.js",
                    "LICENSE",
                    "Makefile",
                    "package.json",
                    "README.md",
                    "script",
                    "javascript/src/grammar.json",
                    "javascript/src/node-types.json",
                    "jsx/src/grammar.json",
                    "jsx/src/node-types.json",
                    "*.wasm",
                ],
                sources: [
                    "javascript/src/parser.c",
                    "javascript/src/scanner.c",
                    "jsx/src/parser.c",
                    "jsx/src/scanner.c",
                ],
                resources: [
                    .copy("queries")
                ],
                publicHeadersPath: "bindings/swift",
                cSettings: [.headerSearchPath("javascript/src")])
    ]
)
