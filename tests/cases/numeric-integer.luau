local i1: integer = 123456789i
local i2: integer = -1_048_576i
local i3: integer = -99i
const i4: integer = 0xfedcba9876543210i
const i5: integer = -0xFFFF_FFFFi
local i6: integer = 0b01010101i
local i7: integer = -0b_0101_0101i

-- failure cases
local i8: integer = 1.i
local i9: integer = -1.0i
local i10: integer = 5e7i
local i11: integer = -5ie7
local i12: integer = 1.2ie3
local i13: integer = _5i