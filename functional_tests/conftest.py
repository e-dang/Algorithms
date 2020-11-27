import pytest
from selenium import webdriver


@pytest.fixture(params=['firefox'], scope="class")
def driver_init(request):
    request.cls.driver = webdriver.Firefox()

    yield

    request.cls.driver.quit()
