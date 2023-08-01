export type A = {
    LOL: "yes",
}

local a: xd.Something<{
    transparency: typeof(React.createBinding(0))
}> = function()

end

local c: xd.Something<{
    transparency: typeof(React.createBinding(0)), -- this comma is the reason why it diess!!
}> = function() -- it dies
    local a = "hello world"
end