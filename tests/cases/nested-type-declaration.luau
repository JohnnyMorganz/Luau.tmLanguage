-- Positive: nested type declarations
if true then
    type Foo = string
end

do
    export type Bar = number
end

while true do
    type Callback = (string) -> number
end

-- Positive: top-level (must not regress)
type TopLevel = boolean

-- Positive: nested type function
do
    export type function Identity(t)
    end
end

-- Regression: type as function call (NOT a type declaration)
local x = type(something)
if type(value) == "string" then end

-- Regression: type as property access (NOT a type declaration)
print(x.type)
