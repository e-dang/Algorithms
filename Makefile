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

deploy-staging:
	cd $(mkfile_path)/ansible && \
	ansible-playbook -i inventory.ansible create_user.yml --limit staging --extra-vars "ansible_ssh_user=root" && \
	ansible-playbook -i inventory.ansible provision.yml --limit staging --become && \
	ansible-playbook -i inventory.ansible deployed.yml --limit staging --become

deploy-prod:
	cd $(mkfile_path)/ansible && \
	ansible-playbook -i inventory.ansible create_user.yml --limit prod --extra-vars "ansible_ssh_user=root" && \
	ansible-playbook -i inventory.ansible provision.yml --limit prod --become && \
	ansible-playbook -i inventory.ansible deployed.yml --limit prod --become