(
    (ternary_expression condition: (_)
        consequence: (_)* @consequence
        alternative: (_)* @alternative)
@ternary_expression
(#eq? @consequence @alternative)
)