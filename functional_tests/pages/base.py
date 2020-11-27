from selenium.webdriver.support.ui import WebDriverWait


class BaseInputElement:
    """
    https://selenium-python.readthedocs.io/page-objects.html
    """

    TIMEOUT = 100

    def __set__(self, obj, value):
        driver = obj.driver
        WebDriverWait(driver, self.TIMEOUT).until(
            lambda driver: driver.find_element_by_id(self.locator))
        driver.find_element_by_id(self.locator).clear()
        driver.find_element_by_id(self.locator).send_keys(value)

    def __get__(self, obj, owner):
        driver = obj.driver
        WebDriverWait(driver, self.TIMEOUT).until(
            lambda driver: driver.find_element_by_id(self.locator))
        return driver.find_element_by_id(self.locator).get_attribute('value')


class BasePage:
    def __init__(self, driver):
        self.driver = driver
