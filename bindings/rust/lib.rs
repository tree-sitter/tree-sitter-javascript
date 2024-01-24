// -*- coding: utf-8 -*-
// ------------------------------------------------------------------------------------------------
// Copyright © 2020, tree-sitter-javascript authors.
// See the LICENSE file in this repo for license details.
// ------------------------------------------------------------------------------------------------

//! This crate provides a JavaScript grammar for the [tree-sitter][] parsing library.
//!
//! Typically, you will use the [language][language func] function to add this grammar to a
//! tree-sitter [Parser][], and then use the parser to parse some code:
//!
//! ```
//! use tree_sitter::Parser;
//!
//! let code = r#"
//!     function double(x) {
//!         return x * 2;
//!     }
//! "#;
//! let mut parser = Parser::new();
//! parser
//!     .set_language(tree_sitter_javascript::language_javascript())
//!     .expect("Error loading JavaScript grammar");
//! let parsed = parser.parse(code, None);
//! # let parsed = parsed.unwrap();
//! # let root = parsed.root_node();
//! # assert!(!root.has_error());
//! ```
//!
//! [Language]: https://docs.rs/tree-sitter/*/tree_sitter/struct.Language.html
//! [language func]: fn.language.html
//! [Parser]: https://docs.rs/tree-sitter/*/tree_sitter/struct.Parser.html
//! [tree-sitter]: https://tree-sitter.github.io/

use tree_sitter::Language;

extern "C" {
    fn tree_sitter_javascript() -> Language;
    fn tree_sitter_jsx() -> Language;
}

/// Returns the tree-sitter [Language][] for this JavaScript.
///
/// [Language]: https://docs.rs/tree-sitter/*/tree_sitter/struct.Language.html
pub fn language_javascript() -> Language {
    unsafe { tree_sitter_javascript() }
}

/// Returns the tree-sitter [Language][] for JSX.
///
/// [Language]: https://docs.rs/tree-sitter/*/tree_sitter/struct.Language.html
pub fn language_jsx() -> Language {
    unsafe { tree_sitter_jsx() }
}

/// The source of the JavaScript tree-sitter grammar description.
pub const JAVASCRIPT_GRAMMAR: &str = include_str!("../../javascript/grammar.js");
pub const JSX_GRAMMAR: &str = include_str!("../../jsx/grammar.js");

/// The syntax highlighting query for this language.
pub const HIGHLIGHT_QUERY: &str = include_str!("../../queries/highlights.scm");

/// The syntax highlighting query for languages injected into this one.
pub const INJECTION_QUERY: &str = include_str!("../../queries/injections.scm");

/// The syntax highlighting query for JSX.
pub const JSX_HIGHLIGHT_QUERY: &str = include_str!("../../queries/highlights-jsx.scm");

/// The local-variable syntax highlighting query for this language.
pub const LOCALS_QUERY: &str = include_str!("../../queries/locals.scm");

/// The symbol tagging query for this language.
pub const TAGGING_QUERY: &str = include_str!("../../queries/tags.scm");

/// The content of the [`node-types.json`][] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers#static-node-types
pub const JAVASCRIPT_NODE_TYPES: &str = include_str!("../../javascript/src/node-types.json");
pub const JSX_NODE_TYPES: &str = include_str!("../../jsx/src/node-types.json");

#[cfg(test)]
mod tests {
    #[test]
    fn can_load_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(super::language())
            .expect("Error loading JavaScript grammar");
    }
}
