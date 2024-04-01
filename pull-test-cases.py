# Retrieves test cases from the full-moon and stylua repository
# https://github.com/Kampfkarren/full-moon
# https://github.com/JohnnyMorganz/StyLua

import os
import shutil

FULL_MOON_CLONE = "git clone --depth=1 https://github.com/Kampfkarren/full-moon.git"
FULL_MOON_LUA_TESTS_DIRS = "./full-moon/full-moon/tests/cases/pass"
FULL_MOON_LUAU_TESTS_DIR = "./full-moon/full-moon/tests/roblox_cases/pass"

STYLUA_CLONE = "git clone --depth=1 https://github.com/JohnnyMorganz/StyLua.git"
STYLUA_LUA_TESTS_DIRS = "./stylua/tests/inputs"
STYLUA_LUAU_TESTS_DIR = "./stylua/tests/inputs-luau"

OUTPUT_DIRECTORY = "./tests/cases"

# Clone the relevant repositories
os.system(FULL_MOON_CLONE)
os.system(STYLUA_CLONE)


# Copy new tests
def copy_test_files(input: str, output_directory: str, prefix: str):
    for test in os.listdir(input):
        source_file = os.path.join(input, test)
        if os.path.isdir(source_file):
            source_file = os.path.join(source_file, "source.lua")
        shutil.copyfile(
            source_file, os.path.join(output_directory, prefix + test + ".luau")
        )


copy_test_files(FULL_MOON_LUA_TESTS_DIRS, OUTPUT_DIRECTORY, "full-moon-lua-")
copy_test_files(FULL_MOON_LUAU_TESTS_DIR, OUTPUT_DIRECTORY, "full-moon-luau-")

copy_test_files(STYLUA_LUA_TESTS_DIRS, OUTPUT_DIRECTORY, "stylua-lua-")
copy_test_files(STYLUA_LUAU_TESTS_DIR, OUTPUT_DIRECTORY, "stylua-luau-")

# Cleanup the cloned repositories
shutil.rmtree("./full-moon", ignore_errors=True)
shutil.rmtree("./stylua", ignore_errors=True)
