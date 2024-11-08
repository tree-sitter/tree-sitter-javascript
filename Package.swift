// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterJavaScript",
    products: [
        .library(name: "TreeSitterJavaScript", targets: ["TreeSitterJavaScript"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterJavaScript",
            dependencies: [],
            path: ".",
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
            name: "TreeSitterJavaScriptTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterJavaScript",
            ],
            path: "bindings/swift/TreeSitterJavaScriptTests"
        )
    ],
    cLanguageStandard: .c11
)
