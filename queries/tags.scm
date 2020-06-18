(
  (comment)* @doc
  (method_definition
    name: (property_identifier) @name) @definition.method
  (#strip! @doc "^[\\s\\*/]+|^[\\s\\*/]$")
  (#select-adjacent! @doc @definition.method)
)

(
  (comment)* @doc
  [
    (class
      name: (identifier) @name)
    (class_declaration
      name: (identifier) @name)
  ] @definition.class
  (#strip! @doc "^[\\s\\*/]+|^[\\s\\*/]$")
  (#select-adjacent! @doc @definition.class)
)

(
  (comment)+? @doc
  (lexical_declaration
    (variable_declarator
      name: (identifier) @name
      value: [(arrow_function) (function)]) @definition.function)
  (#strip! @doc "^[\\s\\*/]+|^[\\s\\*/]$")
  (#select-adjacent! @doc @definition.function)
)

(call_expression
  function: (identifier) @name) @reference.call

(call_expression
  function: (member_expression
    property: (property_identifier) @name)) @reference.call
