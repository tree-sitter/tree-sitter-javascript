import XCTest
import SwiftTreeSitter
import TreeSitterJavascript

final class TreeSitterJavascriptTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_javascript())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Javascript grammar")
    }
}
