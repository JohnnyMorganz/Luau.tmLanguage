@attr_1 @attr_2
local function a()
end

local b = @attr_1 @attr_2 function() end

c(@attr_1 @attr_2 function() end)

@attr_1
local function d()
end

local e = @attr_1 function() end

f(@attr_1 function() end)

@attr_1 @attr_2 local function g() end
@attr1 local function h() end

---@doc_comment
@attr_1
local function i() end