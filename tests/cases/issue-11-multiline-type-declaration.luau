type Foo =
    | string
    | number

export type Bar =
    string
    | number
    | boolean

type WithComments =
    -- leading comment
    | string
    -- middle comment
    | number

type SingleLine = string | number

type Qualified =
    Foo.Bar
    | Baz.Qux

type WithTable =
    | { field: string }
    | number

type BeforeAssignment =
    | string
    | number
y = 1

type BeforeMethodCall =
    | string
x:method()

type BeforeIndex =
    | string
x[1] = 2

type BeforeDottedAssignment =
    | string
x.foo = 1

type BeforeFunction =
    | string
    | number
function foo() end

type BeforeLocal =
    | string
local z = 1
