extern crate cc;

use std::env;
use std::path::PathBuf;

fn main() 
{
    let mut javascript_config = cc::Build::new();
    javascript_config
        .include("src")
        .file("src/parser.c")
        .file("src/scanner.c")
        .compile("javascript");
}