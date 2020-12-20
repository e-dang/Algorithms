PROJECT_DIR := `dirname $(abspath $(MAKEFILE_LIST))`
STATIC_DIR := $(PROJECT_DIR)/path_finding/static
ANSIBLE_DIR := $(PROJECT_DIR)/ansible
TERRAFORM_DIR := $(PROJECT_DIR)/terraform
HEADLESS := $(if $(CI), --headless, )

install:
	python3 -m pip install -U pip
	pip install -r requirements.txt
	pip install -r requirements-dev.txt
	cd $(STATIC_DIR) && yarn install

build:
	cd $(STATIC_DIR) && yarn build

test-js:
	cd $(STATIC_DIR)/tests && yarn test

test-py:
	cd $(PROJECT_DIR) && pytest -m unit

test-unit: test-js test-py

test-ft:
	cd $(PROJECT_DIR) && pytest $(HEADLESS) functional_tests

test: test-unit test-ft

test-ft-staging:
	cd $(PROJECT_DIR) && STAGING_SERVER=$(STAGING_DOMAIN) pytest $(HEADLESS) functional_tests

provision-resources:
	cd $(TERRAFORM_DIR) && \
	terraform init && \
	terraform apply -auto-approve

clean-resources:
	cd $(TERRAFORM_DIR) && \
	terraform destroy -auto-approve

provision-software:
	cd $(ANSIBLE_DIR) && \
	ansible-playbook -i inventory.ansible provision.yml

deploy-staging:
	cd $(ANSIBLE_DIR) && \
	ansible-playbook -i inventory.ansible deploy.yml --limit staging --extra-vars "$(ARGS)"

deploy-prod:
	cd $(ANSIBLE_DIR) && \
	ansible-playbook -i inventory.ansible deploy.yml --limit prod --extra-vars version=master