mkfile_path := `dirname $(abspath $(MAKEFILE_LIST))`
static_path := $(mkfile_path)/path_finding/static

install-ci:
	python3 -m pip install -U pip
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
	echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
	sudo apt update && sudo apt install yarn
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