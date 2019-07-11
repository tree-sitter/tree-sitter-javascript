extern crate cc;

use std::path::Path;

fn main() 
{
    let src_path : &Path = Path::new("src");

    let mut javascript_config = cc::Build::new();
    javascript_config
        .include(src_path)
        .file(src_path.join("parser.c"))
        .file(src_path.join("scanner.c"))
        .compile("javascript");
}