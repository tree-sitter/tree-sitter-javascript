// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterJavascript",
    products: [
        .library(name: "TreeSitterJavascript", targets: ["TreeSitterJavascript"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterJavascript",
            dependencies: [],
            path: ".",
            exclude: [
                "Cargo.toml",
                "Makefile",
                "binding.gyp",
                "bindings/c",
                "bindings/go",
                "bindings/node",
                "bindings/python",
                "bindings/rust",
                "prebuilds",
                "grammar.js",
                "package.json",
                "package-lock.json",
                "pyproject.toml",
                "setup.py",
                "test",
                "examples",
                ".editorconfig",
                ".github",
                ".gitignore",
                ".gitattributes",
                ".gitmodules",
            ],
            sources: [
                "src/parser.c",
                "src/scanner.c",
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterJavascriptTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterJavascript",
            ],
            path: "bindings/swift/TreeSitterJavascriptTests"
        )
    ],
    cLanguageStandard: .c11
)
