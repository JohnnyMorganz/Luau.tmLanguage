# Retrieves test cases from the full-moon repository
# https://github.com/Kampfkarren/full-moon

import os
import shutil

FULL_MOON_CLONE = "git clone https://github.com/Kampfkarren/full-moon.git"
FULL_MOON_LUA_TESTS_DIRS = "./full-moon/full-moon/tests/cases/pass"
FULL_MOON_LUAU_TESTS_DIR = "./full-moon/full-moon/tests/roblox_cases/pass"

OUTPUT_DIRECTORY = "./tests/cases"

# Clone the relevant repositories
os.system(FULL_MOON_CLONE)

# Copy new tests
def copy_test_files(input: str, output_directory: str, prefix: str):
    for test in os.listdir(input):
        source_file = os.path.join(input, test, "source.lua")
        shutil.copyfile(source_file, os.path.join(output_directory, prefix + test + ".luau"))

copy_test_files(FULL_MOON_LUA_TESTS_DIRS, OUTPUT_DIRECTORY, "full-moon-lua-")
copy_test_files(FULL_MOON_LUAU_TESTS_DIR, OUTPUT_DIRECTORY, "full-moon-luau-")

# Cleanup the cloned repositories
shutil.rmtree("./full-moon", ignore_errors=True)