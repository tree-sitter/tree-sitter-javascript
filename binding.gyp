{
  "targets": [
    {
      "target_name": "tree_sitter_javascript_binding",
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "javascript/src"
      ],
      "sources": [
        "javascript/src/parser.c",
        "javascript/src/scanner.c",
        "jsx/src/parser.c",
        "jsx/src/scanner.c",
        "bindings/node/binding.cc"
      ],
      "cflags_c": [
        "-std=c99",
      ]
    }
  ]
}
