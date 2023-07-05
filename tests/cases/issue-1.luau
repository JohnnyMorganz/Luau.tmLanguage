local function returnsComplexType()
	return {} :: { [string]: { number } }
end

-- Key and [1] both have incorrect highlighting
type Inner = typeof(returnsComplexType().Key[1])

-- This has correct highlighting
local inner = returnsComplexType().Key[1]
