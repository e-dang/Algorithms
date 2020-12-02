mkfile_path := `dirname $(abspath $(MAKEFILE_LIST))`
static_path := $(mkfile_path)/path_finding/static

install:
	python3 -m pip install -U pip
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	cd $(static_path) && yarn install

build:
	cd $(static_path) && yarn build

test-js:
	cd $(mkfile_path)/path_finding/static/tests && yarn test

test-py:
	cd $(mkfile_path) && pytest -m unit

test-unit: test-js test-py

test-ft:
	cd $(mkfile_path) && pytest -m functional

test: test-unit test-ft