mkfile_path := `dirname $(abspath $(MAKEFILE_LIST))`

build:
	cd $(mkfile_path)/path_finding/static && yarn build

test_js:
	cd $(mkfile_path)/path_finding/static/tests && yarn test

test_py:
	cd $(mkfile_path) && pytest -m unit

test_unit: test_js test_py

test_ft:
	cd $(mkfile_path) && pytest -m functional

test: test_unit test_ft
