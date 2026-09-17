/**
 * @file JavaScript grammar for tree-sitter
 * @author Max Brunsfeld <maxbrunsfeld@gmail.com>
 * @author Amaan Qureshi <amaanq12@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl.d.ts" />
// @ts-check

export const
  program = rule(() => seq(
    optional(hash_bang_line),
    repeat(statement),
  )),

  hash_bang_line = rule(() => /#!.*/),

  //
  // Export declarations
  //

  export_statement = rule(() => choice(
    seq(
      'export',
      choice(
        seq('*', _from_clause),
        seq(namespace_export, _from_clause),
        seq(export_clause, _from_clause),
        export_clause,
      ),
      _semicolon,
    ),
    seq(
      repeat(field('decorator', decorator)),
      'export',
      choice(
        field('declaration', declaration),
        seq(
          'default',
          choice(
            field('declaration', declaration),
            seq(
              field('value', expression),
              _semicolon,
            ),
          ),
        ),
      ),
    ),
  )),

  namespace_export = rule(() => seq(
    '*', 'as', _module_export_name,
  )),

  export_clause = rule(() => seq(
    '{',
    commaSep(export_specifier),
    optional(','),
    '}',
  )),

  export_specifier = rule(() => seq(
    field('name', _module_export_name),
    optional(seq(
      'as',
      field('alias', _module_export_name),
    )),
  )),

  _module_export_name = rule(() => choice(
    identifier,
    string,
    'default',
  )),

  declaration = rule(() => choice(
    function_declaration,
    generator_function_declaration,
    class_declaration,
    lexical_declaration,
    variable_declaration,
    using_declaration,
  )),

  //
  // Import declarations
  //

  import_ = rule(() => token('import')),

  import_statement = rule(() => seq(
    'import',
    choice(
      seq(import_clause, _from_clause),
      field('source', string),
    ),
    optional(import_attribute),
    _semicolon,
  )),

  import_clause = rule(() => choice(
    namespace_import,
    named_imports,
    seq(
      identifier,
      optional(seq(
        ',',
        choice(
          namespace_import,
          named_imports,
        ),
      )),
    ),
  )),

  _from_clause = rule(() => seq(
    'from', field('source', string),
  )),

  namespace_import = rule(() => seq(
    '*', 'as', identifier,
  )),

  named_imports = rule(() => seq(
    '{',
    commaSep(import_specifier),
    optional(','),
    '}',
  )),

  import_specifier = rule(() => choice(
    field('name', identifier),
    seq(
      field('name', _module_export_name),
      'as',
      field('alias', identifier),
    ),
  )),

  import_attribute = rule(() => seq('with', object)),

  //
  // Statements
  //

  statement = rule(() => choice(
    export_statement,
    import_statement,
    debugger_statement,
    expression_statement,
    declaration,
    statement_block,

    if_statement,
    switch_statement,
    for_statement,
    for_in_statement,
    while_statement,
    do_statement,
    try_statement,
    with_statement,

    break_statement,
    continue_statement,
    return_statement,
    throw_statement,
    empty_statement,
    labeled_statement,
  )),

  expression_statement = rule(() => seq(
    _expressions,
    _semicolon,
  )),

  variable_declaration = rule(() => seq(
    'var',
    commaSep1(variable_declarator),
    _semicolon,
  )),

  lexical_declaration = rule(() => seq(
    field('kind', choice('let', 'const')),
    commaSep1(variable_declarator),
    _semicolon,
  )),

  using_declaration = rule(() => seq(
    field('kind', choice(
      'using',
      seq('await', 'using'),
    )),
    commaSep1(variable_declarator),
    _semicolon,
  )),

  variable_declarator = rule(() => seq(
    field('name', choice(
      identifier,
      alias('of', identifier),
      _destructuring_pattern,
    )),
    optional(_initializer),
  )),

  statement_block = rule(() => prec.right(seq(
    '{',
    repeat(statement),
    '}',
    optional(_automatic_semicolon),
  ))),

  else_clause = rule(() => seq('else', statement)),

  if_statement = rule(() => prec.right(seq(
    'if',
    field('condition', parenthesized_expression),
    field('consequence', statement),
    optional(field('alternative', else_clause)),
  ))),

  switch_statement = rule(() => seq(
    'switch',
    field('value', parenthesized_expression),
    field('body', switch_body),
  )),

  for_statement = rule(() => seq(
    'for',
    '(',
    choice(
      field('initializer', choice(lexical_declaration, variable_declaration)),
      seq(field('initializer', _expressions), ';'),
      field('initializer', empty_statement),
    ),
    field('condition', choice(
      seq(_expressions, ';'),
      empty_statement,
    )),
    field('increment', optional(_expressions)),
    ')',
    field('body', statement),
  )),

  for_in_statement = rule(() => seq(
    'for',
    optional('await'),
    _for_header,
    field('body', statement),
  )),

  _for_header = rule(() => seq(
    '(',
    choice(
      field('left', choice(
        _lhs_expression,
        parenthesized_expression,
      )),
      seq(
        field('kind', 'var'),
        field('left', choice(
          identifier,
          alias('of', identifier),
          _destructuring_pattern,
        )),
        optional(_initializer),
      ),
      seq(
        field('kind', choice('let', 'const')),
        field('left', choice(
          identifier,
          alias('of', identifier),
          _destructuring_pattern,
        )),
        optional(_automatic_semicolon),
      ),
      seq(
        field('kind', choice(
          'using',
          seq('await', 'using'),
        )),
        field('left', choice(
          identifier,
          alias('of', identifier),
          _destructuring_pattern,
        )),
        optional(_automatic_semicolon),
      ),
    ),
    field('operator', choice('in', 'of')),
    field('right', _expressions),
    ')',
  )),

  while_statement = rule(() => seq(
    'while',
    field('condition', parenthesized_expression),
    field('body', statement),
  )),

  do_statement = rule(() => prec.right(seq(
    'do',
    field('body', statement),
    'while',
    field('condition', parenthesized_expression),
    optional(_semicolon),
  ))),

  try_statement = rule(() => seq(
    'try',
    field('body', statement_block),
    optional(field('handler', catch_clause)),
    optional(field('finalizer', finally_clause)),
  )),

  with_statement = rule(() => seq(
    'with',
    field('object', parenthesized_expression),
    field('body', statement),
  )),

  break_statement = rule(() => seq(
    'break',
    field('label', optional(alias(identifier, statement_identifier))),
    _semicolon,
  )),

  continue_statement = rule(() => seq(
    'continue',
    field('label', optional(alias(identifier, statement_identifier))),
    _semicolon,
  )),

  debugger_statement = rule(() => seq(
    'debugger',
    _semicolon,
  )),

  return_statement = rule(() => seq(
    'return',
    optional(_expressions),
    _semicolon,
  )),

  throw_statement = rule(() => seq(
    'throw',
    _expressions,
    _semicolon,
  )),

  empty_statement = rule(() => ';'),

  labeled_statement = rule(() => prec.dynamic(-1, seq(
    field('label', alias(choice(identifier, _reserved_identifier), statement_identifier)),
    ':',
    field('body', statement),
  ))),

  //
  // Statement components
  //

  switch_body = rule(() => seq(
    '{',
    repeat(choice(switch_case, switch_default)),
    '}',
  )),

  switch_case = rule(() => seq(
    'case',
    field('value', _expressions),
    ':',
    field('body', repeat(statement)),
  )),

  switch_default = rule(() => seq(
    'default',
    ':',
    field('body', repeat(statement)),
  )),

  catch_clause = rule(() => seq(
    'catch',
    optional(seq('(', field('parameter', choice(identifier, _destructuring_pattern)), ')')),
    field('body', statement_block),
  )),

  finally_clause = rule(() => seq(
    'finally',
    field('body', statement_block),
  )),

  parenthesized_expression = rule(() => seq(
    '(',
    _expressions,
    ')',
  )),

  //
  // Expressions
  //
  _expressions = rule(() => choice(
    expression,
    sequence_expression,
  )),

  expression = rule(() => choice(
    primary_expression,
    _jsx_element,
    assignment_expression,
    augmented_assignment_expression,
    await_expression,
    unary_expression,
    binary_expression,
    ternary_expression,
    update_expression,
    new_expression,
    yield_expression,
  )),

  primary_expression = rule(() => choice(
    subscript_expression,
    member_expression,
    parenthesized_expression,
    _identifier,
    alias(_reserved_identifier, identifier),
    this_,
    super_,
    number,
    string,
    template_string,
    regex,
    true_,
    false_,
    null_,
    object,
    array,
    function_expression,
    arrow_function,
    generator_function,
    class_,
    meta_property,
    call_expression,
  )),

  yield_expression = rule(() => prec.right(seq(
    'yield',
    choice(
      seq('*', expression),
      optional(expression),
    )))),

  object = rule(() => prec('object', seq(
    '{',
    commaSep(optional(choice(
      pair,
      spread_element,
      method_definition,
      alias(
        choice(identifier, _reserved_identifier),
        shorthand_property_identifier,
      ),
    ))),
    '}',
  ))),

  object_pattern = rule(() => prec('object', seq(
    '{',
    commaSep(optional(choice(
      pair_pattern,
      rest_pattern,
      object_assignment_pattern,
      alias(
        choice(identifier, _reserved_identifier),
        shorthand_property_identifier_pattern,
      ),
    ))),
    '}',
  ))),

  assignment_pattern = rule(() => seq(
    field('left', pattern),
    '=',
    field('right', expression),
  )),

  object_assignment_pattern = rule(() => seq(
    field('left', choice(
      alias(choice(_reserved_identifier, identifier), shorthand_property_identifier_pattern),
      _destructuring_pattern,
    )),
    '=',
    field('right', expression),
  )),

  array = rule(() => seq(
    '[',
    commaSep(optional(choice(
      expression,
      spread_element,
    ))),
    ']',
  )),

  array_pattern = rule(() => seq(
    '[',
    commaSep(optional(choice(
      pattern,
      assignment_pattern,
    ))),
    ']',
  )),

  _jsx_element = rule(() => choice(jsx_element, jsx_self_closing_element)),

  jsx_element = rule(() => seq(
    field('open_tag', jsx_opening_element),
    repeat(_jsx_child),
    field('close_tag', jsx_closing_element),
  )),

  // An entity can be named, numeric (decimal), or numeric (hexadecimal). The
  // longest entity name is 29 characters long, and the HTML spec says that
  // no more will ever be added.
  html_character_reference = rule(() => /&(#([xX][0-9a-fA-F]{1,6}|[0-9]{1,5})|[A-Za-z]{1,30});/),

  jsx_expression = rule(() => seq(
    '{',
    optional(choice(
      expression,
      sequence_expression,
      spread_element,
    )),
    '}',
  )),

  _jsx_child = rule(() => choice(
    jsx_text,
    html_character_reference,
    _jsx_element,
    jsx_expression,
  )),

  jsx_opening_element = rule(() => prec.dynamic(-1, seq(
    '<',
    optional(seq(
      field('name', _jsx_element_name),
      repeat(field('attribute', _jsx_attribute)),
    )),
    '>',
  ))),

  jsx_identifier = rule(() => /[a-zA-Z_$][a-zA-Z\d_$]*-[a-zA-Z\d_$\-]*/),

  _jsx_identifier = rule(() => choice(
    alias(jsx_identifier, identifier),
    identifier,
  )),

  nested_identifier = rule(() => prec('member', seq(
    field('object', choice(identifier, alias(nested_identifier, member_expression))),
    '.',
    field('property', alias(identifier, property_identifier)),
  ))),

  jsx_namespace_name = rule(() => seq(_jsx_identifier, ':', _jsx_identifier)),

  _jsx_element_name = rule(() => choice(
    _jsx_identifier,
    alias(nested_identifier, member_expression),
    jsx_namespace_name,
  )),

  jsx_closing_element = rule(() => seq(
    '</',
    optional(field('name', _jsx_element_name)),
    '>',
  )),

  jsx_self_closing_element = rule(() => seq(
    '<',
    field('name', _jsx_element_name),
    repeat(field('attribute', _jsx_attribute)),
    '/>',
  )),

  _jsx_attribute = rule(() => choice(jsx_attribute, jsx_expression)),

  _jsx_attribute_name = rule(() => choice(alias(_jsx_identifier, property_identifier), jsx_namespace_name)),

  jsx_attribute = rule(() => seq(
    _jsx_attribute_name,
    optional(seq(
      '=',
      _jsx_attribute_value,
    )),
  )),

  _jsx_string = rule(() => choice(
    seq(
      '"',
      repeat(choice(
        alias(unescaped_double_jsx_string_fragment, string_fragment),
        html_character_reference,
      )),
      '"',
    ),
    seq(
      '\'',
      repeat(choice(
        alias(unescaped_single_jsx_string_fragment, string_fragment),
        html_character_reference,
      )),
      '\'',
    ),
  )),

  // Workaround to https://github.com/tree-sitter/tree-sitter/issues/1156
  // We give names to the token() constructs containing a regexp
  // so as to obtain a node in the CST.
  //
  unescaped_double_jsx_string_fragment = rule(() => token.immediate(prec(1, /([^"&]|&[^#A-Za-z])+/))),

  // same here
  unescaped_single_jsx_string_fragment = rule(() => token.immediate(prec(1, /([^'&]|&[^#A-Za-z])+/))),

  _jsx_attribute_value = rule(() => choice(
    alias(_jsx_string, string),
    jsx_expression,
    _jsx_element,
  )),

  class_ = rule(() => prec('literal', seq(
    repeat(field('decorator', decorator)),
    'class',
    field('name', optional(identifier)),
    optional(class_heritage),
    field('body', class_body),
  ))),

  class_declaration = rule(() => prec('declaration', seq(
    repeat(field('decorator', decorator)),
    'class',
    field('name', identifier),
    optional(class_heritage),
    field('body', class_body),
    optional(_automatic_semicolon),
  ))),

  class_heritage = rule(() => seq('extends', expression)),

  function_expression = rule(() => prec('literal', seq(
    optional('async'),
    'function',
    field('name', optional(identifier)),
    _call_signature,
    field('body', statement_block),
  ))),

  function_declaration = rule(() => prec.right('declaration', seq(
    optional('async'),
    'function',
    field('name', identifier),
    _call_signature,
    field('body', statement_block),
    optional(_automatic_semicolon),
  ))),

  generator_function = rule(() => prec('literal', seq(
    optional('async'),
    'function',
    '*',
    field('name', optional(identifier)),
    _call_signature,
    field('body', statement_block),
  ))),

  generator_function_declaration = rule(() => prec.right('declaration', seq(
    optional('async'),
    'function',
    '*',
    field('name', identifier),
    _call_signature,
    field('body', statement_block),
    optional(_automatic_semicolon),
  ))),

  arrow_function = rule(() => seq(
    optional('async'),
    choice(
      field('parameter', choice(
        alias(_reserved_identifier, identifier),
        identifier,
      )),
      _call_signature,
    ),
    '=>',
    field('body', choice(
      expression,
      statement_block,
    )),
  )),

  // Override
  _call_signature = rule(() => field('parameters', formal_parameters)),

  _formal_parameter = rule(() => choice(pattern, assignment_pattern)),

  optional_chain = rule(() => '?.'),

  call_expression = rule(() => choice(
    prec('call', seq(
      field('function', choice(expression, import_)),
      field('arguments', arguments_),
    )),
    prec('template_call', seq(
      field('function', choice(primary_expression, new_expression)),
      field('arguments', template_string),
    )),
    prec('member', seq(
      field('function', primary_expression),
      field('optional_chain', optional_chain),
      field('arguments', arguments_),
    )),
  )),

  new_expression = rule(() => prec.right('new', seq(
    'new',
    field('constructor', choice(primary_expression, new_expression)),
    field('arguments', optional(prec.dynamic(1, arguments_))),
  ))),

  await_expression = rule(() => prec('unary_void', seq(
    'await',
    expression,
  ))),

  member_expression = rule(() => prec('member', seq(
    field('object', choice(expression, primary_expression, import_)),
    choice('.', field('optional_chain', optional_chain)),
    field('property', choice(
      private_property_identifier,
      reserved('properties', alias(identifier, property_identifier)),
    )),
  ))),

  subscript_expression = rule(() => prec.right('member', seq(
    field('object', choice(expression, primary_expression)),
    optional(field('optional_chain', optional_chain)),
    '[', field('index', _expressions), ']',
  ))),

  _lhs_expression = rule(() => choice(
    member_expression,
    subscript_expression,
    _identifier,
    alias(_reserved_identifier, identifier),
    _destructuring_pattern,
  )),

  assignment_expression = rule(() => prec.right('assign', seq(
    field('left', choice(parenthesized_expression, _lhs_expression)),
    '=',
    field('right', expression),
  ))),

  _augmented_assignment_lhs = rule(() => choice(
    member_expression,
    subscript_expression,
    alias(_reserved_identifier, identifier),
    identifier,
    parenthesized_expression,
  )),

  augmented_assignment_expression = rule(() => prec.right('assign', seq(
    field('left', _augmented_assignment_lhs),
    field('operator', choice('+=', '-=', '*=', '/=', '%=', '^=', '&=', '|=', '>>=', '>>>=',
      '<<=', '**=', '&&=', '||=', '??=')),
    field('right', expression),
  ))),

  _initializer = rule(() => seq(
    '=',
    field('value', expression),
  )),

  _destructuring_pattern = rule(() => choice(
    object_pattern,
    array_pattern,
  )),

  spread_element = rule(() => seq('...', expression)),

  ternary_expression = rule(() => prec.right('ternary', seq(
    field('condition', expression),
    alias(_ternary_qmark, '?'),
    field('consequence', expression),
    ':',
    field('alternative', expression),
  ))),

  binary_expression = rule(() => choice(
    ...[
      ['&&', 'logical_and'],
      ['||', 'logical_or'],
      ['>>', 'binary_shift'],
      ['>>>', 'binary_shift'],
      ['<<', 'binary_shift'],
      ['&', 'bitwise_and'],
      ['^', 'bitwise_xor'],
      ['|', 'bitwise_or'],
      ['+', 'binary_plus'],
      ['-', 'binary_plus'],
      ['*', 'binary_times'],
      ['/', 'binary_times'],
      ['%', 'binary_times'],
      ['**', 'binary_exp', 'right'],
      ['<', 'binary_relation'],
      ['<=', 'binary_relation'],
      ['==', 'binary_equality'],
      ['===', 'binary_equality'],
      ['!=', 'binary_equality'],
      ['!==', 'binary_equality'],
      ['>=', 'binary_relation'],
      ['>', 'binary_relation'],
      ['??', 'ternary'],
      ['instanceof', 'binary_relation'],
      ['in', 'binary_relation'],
    ].map(([operator, precedence, associativity]) =>
      (associativity === 'right' ? prec.right : prec.left)(precedence, seq(
        field('left', operator === 'in' ? choice(expression, private_property_identifier) : expression),
        field('operator', operator),
        field('right', expression),
      )),
    ),
  )),

  unary_expression = rule(() => prec.left('unary_void', seq(
    field('operator', choice('!', '~', '-', '+', 'typeof', 'void', 'delete')),
    field('argument', expression),
  ))),

  update_expression = rule(() => prec.left(choice(
    seq(
      field('argument', expression),
      field('operator', choice('++', '--')),
    ),
    seq(
      field('operator', choice('++', '--')),
      field('argument', expression),
    ),
  ))),

  sequence_expression = rule(() => prec.right(commaSep1(expression))),

  //
  // Primitives
  //

  string = rule(() => choice(
    seq(
      '"',
      repeat(choice(
        alias(unescaped_double_string_fragment, string_fragment),
        escape_sequence,
      )),
      '"',
    ),
    seq(
      '\'',
      repeat(choice(
        alias(unescaped_single_string_fragment, string_fragment),
        escape_sequence,
      )),
      '\'',
    ),
  )),

  // Workaround to https://github.com/tree-sitter/tree-sitter/issues/1156
  // We give names to the token() constructs containing a regexp
  // so as to obtain a node in the CST.
  //
  unescaped_double_string_fragment = rule(() => token.immediate(prec(1, /[^"\\\r\n]+/))),

  // same here
  unescaped_single_string_fragment = rule(() => token.immediate(prec(1, /[^'\\\r\n]+/))),

  escape_sequence = rule(() => token.immediate(seq(
    '\\',
    choice(
      /[^xu0-7]/,
      /[0-7]{1,3}/,
      /x[0-9a-fA-F]{2}/,
      /u[0-9a-fA-F]{4}/,
      /u\{[0-9a-fA-F]+\}/,
      /[\r?][\n\u2028\u2029]/,
    ),
  ))),

  // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
  comment = rule(() => token(choice(
    seq('//', /[^\r\n\u2028\u2029]*/),
    seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/',
    ),
  ))),

  template_string = rule(() => seq(
    '`',
    repeat(choice(
      alias(_template_chars, string_fragment),
      escape_sequence,
      template_substitution,
    )),
    '`',
  )),

  template_substitution = rule(() => seq(
    '${',
    _expressions,
    '}',
  )),

  regex = rule(() => seq(
    '/',
    field('pattern', regex_pattern),
    token.immediate(prec(1, '/')),
    optional(field('flags', regex_flags)),
  )),

  regex_pattern = rule(() => token.immediate(prec(-1,
    repeat1(choice(
      seq(
        '[',
        repeat(choice(
          seq('\\', /./), // escaped character
          /[^\]\n\\]/, // any character besides ']' or '\n'
        )),
        ']',
      ), // square-bracket-delimited character class
      seq('\\', /./), // escaped character
      /[^/\\\[\n]/, // any character besides '[', '\', '/', '\n'
    )),
  ))),

  regex_flags = rule(() => token.immediate(/[a-z]+/)),

  number = rule(() => {
    const hexLiteral = seq(
      choice('0x', '0X'),
      /[\da-fA-F](_?[\da-fA-F])*/,
    );

    const decimalDigits = /\d(_?\d)*/;
    const signedInteger = seq(optional(choice('-', '+')), decimalDigits);
    const exponentPart = seq(choice('e', 'E'), signedInteger);

    const binaryLiteral = seq(choice('0b', '0B'), /[0-1](_?[0-1])*/);

    const octalLiteral = seq(choice('0o', '0O'), /[0-7](_?[0-7])*/);

    const bigintLiteral = seq(choice(hexLiteral, binaryLiteral, octalLiteral, decimalDigits), 'n');

    const decimalIntegerLiteral = choice(
      '0',
      seq(optional('0'), /[1-9]/, optional(seq(optional('_'), decimalDigits))),
    );

    const decimalLiteral = choice(
      seq(decimalIntegerLiteral, '.', optional(decimalDigits), optional(exponentPart)),
      seq('.', decimalDigits, optional(exponentPart)),
      seq(decimalIntegerLiteral, exponentPart),
      decimalDigits,
    );

    return token(choice(
      hexLiteral,
      decimalLiteral,
      binaryLiteral,
      octalLiteral,
      bigintLiteral,
    ));
  }),

  // 'undefined' is syntactically a regular identifier in JavaScript.
  // However, its main use is as the read-only global variable whose
  // value is [undefined], for which there's no literal representation
  // unlike 'null'. We gave it its own rule so it's easy to
  // highlight in text editors and other applications.
  _identifier = rule(() => choice(
    undefined,
    identifier,
  )),

  identifier = rule(() => {
    const alpha = new RustRegex('[^\\x00-\\x1F\\s\\p{Zs}0-9:;`"\'@#.,|^&<=>+\\-*/\\\\%?!~()\\[\\]{}\\uFEFF\\u2060\\u200B\\u2028\\u2029]|\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]+\\}');

    const alphanumeric = new RustRegex('[^\\x00-\\x1F\\s\\p{Zs}:;`"\'@#.,|^&<=>+\\-*/\\\\%?!~()\\[\\]{}\\uFEFF\\u2060\\u200B\\u2028\\u2029]|\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]+\\}');
    return token(seq(alpha, repeat(alphanumeric)));
  }),

  private_property_identifier = rule(() => {
    const alpha = new RustRegex('[^\\x00-\\x1F\\s\\p{Zs}0-9:;`"\'@#.,|^&<=>+\\-*/\\\\%?!~()\\[\\]{}\\uFEFF\\u2060\\u200B\\u2028\\u2029]|\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]+\\}');

    const alphanumeric = new RustRegex('[^\\x00-\\x1F\\s\\p{Zs}:;`"\'@#.,|^&<=>+\\-*/\\\\%?!~()\\[\\]{}\\uFEFF\\u2060\\u200B\\u2028\\u2029]|\\\\u[0-9a-fA-F]{4}|\\\\u\\{[0-9a-fA-F]+\\}');
    return token(seq('#', alpha, repeat(alphanumeric)));
  }),

  meta_property = rule(() => choice(seq('new', '.', 'target'), seq('import', '.', 'meta'))),

  this_ = rule(() => 'this'),

  super_ = rule(() => 'super'),

  true_ = rule(() => 'true'),

  false_ = rule(() => 'false'),

  null_ = rule(() => 'null'),

  undefined = rule(() => 'undefined'),

  //
  // Expression components
  //

  arguments_ = rule(() => seq(
    '(',
    commaSep(optional(choice(expression, spread_element))),
    ')',
  )),

  decorator = rule(() => seq(
    '@',
    choice(
      identifier,
      alias(decorator_member_expression, member_expression),
      alias(decorator_call_expression, call_expression),
    ),
  )),

  decorator_member_expression = rule(() => prec('member', seq(
    field('object', choice(
      identifier,
      alias(decorator_member_expression, member_expression),
    )),
    '.',
    field('property', alias(identifier, property_identifier)),
  ))),

  decorator_call_expression = rule(() => prec('call', seq(
    field('function', choice(
      identifier,
      alias(decorator_member_expression, member_expression),
    )),
    field('arguments', arguments_),
  ))),

  class_body = rule(() => seq(
    '{',
    repeat(choice(
      seq(field('member', method_definition), optional(';')),
      seq(field('member', field_definition), _semicolon),
      field('member', class_static_block),
      ';',
    )),
    '}',
  )),

  field_definition = rule(() => seq(
    repeat(field('decorator', decorator)),
    optional('static'),
    field('property', _property_name),
    optional(_initializer),
  )),

  formal_parameters = rule(() => seq(
    '(',
    optional(seq(
      commaSep1(_formal_parameter),
      optional(','),
    )),
    ')',
  )),

  class_static_block = rule(() => seq(
    'static',
    optional(_automatic_semicolon),
    field('body', statement_block),
  )),

  // This negative dynamic precedence ensures that during error recovery,
  // unfinished constructs are generally treated as literal expressions,
  // not patterns.
  pattern = rule(() => prec.dynamic(-1, choice(
    _lhs_expression,
    rest_pattern,
  ))),

  rest_pattern = rule(() => prec.right(seq(
    '...',
    _lhs_expression,
  ))),

  method_definition = rule(() => seq(
    repeat(field('decorator', decorator)),
    optional(choice(
      'static',
      alias(token(seq('static', /\s+/, 'get', /\s*\n/)), 'static get'),
    )),
    optional('async'),
    optional(choice('get', 'set', '*')),
    field('name', _property_name),
    field('parameters', formal_parameters),
    field('body', statement_block),
  )),

  pair = rule(() => seq(
    field('key', _property_name),
    ':',
    field('value', expression),
  )),

  pair_pattern = rule(() => seq(
    field('key', _property_name),
    ':',
    field('value', choice(pattern, assignment_pattern)),
  )),

  _property_name = rule(() => reserved('properties', choice(
    alias(
      choice(identifier, _reserved_identifier),
      property_identifier,
    ),
    private_property_identifier,
    string,
    number,
    computed_property_name,
  ))),

  computed_property_name = rule(() => seq(
    '[',
    expression,
    ']',
  )),

  _reserved_identifier = rule(() => choice(
    'get',
    'set',
    'async',
    'await',
    'static',
    'export',
    'let',
  )),

  _semicolon = rule(() => choice(_automatic_semicolon, ';')),

  _automatic_semicolon = rule(),

  _template_chars = rule(),

  _ternary_qmark = rule(),

  html_comment = rule(),

  jsx_text = rule(),

  statement_identifier = rule(),

  shorthand_property_identifier = rule(),

  shorthand_property_identifier_pattern = rule(),

  property_identifier = rule(),

  string_fragment = rule();

export default {
  name: 'javascript',

  start: program,

  externals: [
    _automatic_semicolon,
    _template_chars,
    _ternary_qmark,
    html_comment,
    '||',
    // We use escape sequence and regex pattern to tell the scanner if we're currently inside a string or template string, in which case
    // it should NOT parse html comments.
    escape_sequence,
    regex_pattern,
    jsx_text,
  ],

  extras: [
    comment,
    html_comment,
    new RustRegex('[\\s\\p{Zs}\\uFEFF\\u2028\\u2029\\u2060\\u200B]'),
  ],

  reserved: {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words
    global: [
      'break',
      'case',
      'catch',
      'class',
      'const',
      'continue',
      'debugger',
      'default',
      'delete',
      'do',
      'else',
      'export',
      'extends',
      'false',
      'finally',
      'for',
      'function',
      'if',
      'import',
      'in',
      'instanceof',
      'new',
      'null',
      'return',
      'super',
      'switch',
      'this',
      'throw',
      'true',
      'try',
      'typeof',
      'var',
      'void',
      'while',
      'with',
    ],
    properties: [],
  },

  supertypes: [
    statement,
    declaration,
    expression,
    primary_expression,
    pattern,
  ],

  inline: [
    _call_signature,
    _formal_parameter,
    _expressions,
    _semicolon,
    _identifier,
    _reserved_identifier,
    _jsx_attribute,
    _jsx_element_name,
    _jsx_child,
    _jsx_element,
    _jsx_attribute_name,
    _jsx_attribute_value,
    _jsx_identifier,
    _lhs_expression,
  ],

  precedences: [
    [
      'member',
      'template_call',
      'call',
      update_expression,
      'unary_void',
      'binary_exp',
      'binary_times',
      'binary_plus',
      'binary_shift',
      'binary_compare',
      'binary_relation',
      'binary_equality',
      'bitwise_and',
      'bitwise_xor',
      'bitwise_or',
      'logical_and',
      'logical_or',
      'ternary',
      sequence_expression,
      arrow_function,
    ],
    ['assign', primary_expression],
    ['member', 'template_call', 'new', 'call', expression],
    ['declaration', 'literal'],
    [primary_expression, statement_block, 'object'],
    [meta_property, import_],
    [import_statement, import_],
    [export_statement, primary_expression],
    [lexical_declaration, primary_expression],
  ],

  conflicts: [
    [primary_expression, _property_name],
    [primary_expression, await_expression],
    [primary_expression, await_expression, _property_name],
    [primary_expression, arrow_function],
    [primary_expression, arrow_function, _property_name],
    [primary_expression, method_definition],
    [primary_expression, rest_pattern],
    [primary_expression, pattern],
    [primary_expression, _for_header],
    [variable_declarator, _for_header],
    [array, array_pattern],
    [object, object_pattern],
    [assignment_expression, pattern],
    [assignment_expression, object_assignment_pattern],
    [labeled_statement, _property_name],
    [computed_property_name, array],
    [binary_expression, _initializer],
    [class_static_block, _property_name],
  ],

  word: identifier,
};

/**
 * Creates a rule to match one or more of the rules separated by a comma
 *
 * @param {RuleOrLiteral} rule
 *
 * @returns {SeqRule}
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

/**
 * Creates a rule to optionally match one or more of the rules separated by a comma
 *
 * @param {RuleOrLiteral} rule
 *
 * @returns {ChoiceRule}
 */
function commaSep(rule) {
  return optional(commaSep1(rule));
}
