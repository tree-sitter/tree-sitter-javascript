fn main() {
    let root_dir = std::path::Path::new(".");
    let javascript_dir = root_dir.join("javascript").join("src");
    let jsx_dir = root_dir.join("jsx").join("src");

    let mut config = cc::Build::new();
    config.include(&javascript_dir);
    config
        .flag_if_supported("-Wno-unused-parameter")
        .flag_if_supported("-Wno-unused-but-set-variable")
        .flag_if_supported("-Wno-trigraphs");

    for path in &[
        javascript_dir.join("parser.c"),
        javascript_dir.join("scanner.c"),
        jsx_dir.join("parser.c"),
        jsx_dir.join("scanner.c"),
    ] {
        config.file(&path);
        println!("cargo:rerun-if-changed={}", path.to_str().unwrap());
    }

    println!(
        "cargo:rerun-if-changed={}",
        root_dir.join("common").join("scanner.h").to_str().unwrap()
    );

    config.compile("parser-scanner");
}
