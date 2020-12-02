import pytest
from selenium import webdriver
from selenium.webdriver import FirefoxOptions


def pytest_addoption(parser):
    parser.addoption('--headless', action='store_true', default='Whether to run the tests headless or not.')


@pytest.fixture(params=['firefox'], scope='class')
def driver_init(request, pytestconfig):
    if pytestconfig.getoption('headless'):
        opts = FirefoxOptions()
        opts.add_argument("--headless")
        request.cls.driver = webdriver.Firefox(firefox_options=opts)
    else:
        request.cls.driver = webdriver.Firefox()

    yield

    request.cls.driver.quit()
