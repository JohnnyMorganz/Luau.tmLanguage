local test_nil: nil
local test_string: string
local test_number: number
local test_boolean: boolean
local test_thread: thread
local test_vector: vector
local test_buffer: buffer
local test_unknown: unknown
local test_never: never
local test_any: any

local function test(
    test_nil: nil,
    test_string: string,
    test_number: number,
    test_boolean: boolean,
    test_thread: thread,
    test_vector: vector,
    test_buffer: buffer,
    test_unknown: unknown,
    test_never: never,
    test_any: any
)
    return
end

type Test = {
    test_nil: nil,
    test_string: string,
    test_number: number,
    test_boolean: boolean,
    test_thread: thread,
    test_vector: vector,
    test_buffer: buffer,
    test_unknown: unknown,
    test_never: never,
    test_any: any
}