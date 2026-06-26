extern fn tree_sitter_javascript() callconv(.c) *const anyopaque;

pub fn language() *const anyopaque {
    return tree_sitter_javascript();
}
