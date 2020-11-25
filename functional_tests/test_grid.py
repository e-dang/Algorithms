import time

import pytest
from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.action_chains import ActionChains

from path_finding.views import DEFAULT_GRID_PARAMS as grid_params

MAX_WAIT = 10


def wait(fn):
    def modified_fn(*args, **kwargs):
        start_time = time.time()
        while True:
            try:
                return fn(*args, **kwargs)
            except (AssertionError, WebDriverException) as e:
                if time.time() - start_time > MAX_WAIT:
                    raise e
                time.sleep(0.5)

    return modified_fn


@pytest.fixture(params=['firefox'], scope="class")
def driver_init(request):
    request.cls.browser = webdriver.Firefox()

    yield

    request.cls.browser.quit()


@pytest.mark.functional
@pytest.mark.usefixtures("driver_init")
class TestGrid:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:8000/path-finding/'

    @wait
    def wait_for_row_in_grid_info_table(self, row_text, browser):
        table = browser.find_element_by_id('gridInfo')
        rows = table.find_elements_by_tag_name('tr')
        assert row_text in [row.text for row in rows]

    @wait
    def wait_for(self, fn):
        return fn()

    @wait
    def wait_for_assert(self, fn):
        assert fn()

    def make_node_id(self, row, col, num_cols):
        return f'n{row * num_cols + col}'

    def test_user_can_customize_grid(self, url):
        # The user goes to the Path Finding Algorithm website
        self.browser.get(url)

        # The user notices the page title and header mention path finding algorithms
        assert 'Path Finding Algorithms' in self.browser.title
        header_text = self.browser.find_element_by_tag_name('h1').text
        assert 'Path Finding Algorithms' in header_text

        # A grid is visible on the page along with information about its dimensions and where the start and end
        # nodes are
        grid = self.browser.find_element_by_class_name('grid')
        table = self.browser.find_element_by_id('gridInfo')
        row_text = [row.text for row in table.find_elements_by_tag_name('tr')]
        assert len(grid.find_elements_by_class_name('node')) == grid_params['num_rows'] * grid_params['num_cols']
        assert 'Dimensions {} {}'.format(grid_params['num_rows'], grid_params['num_cols']) in row_text
        assert 'Start Node {} {}'.format(grid_params['start_row'], grid_params['start_col']) in row_text
        assert 'End Node {} {}'.format(grid_params['end_row'], grid_params['end_col']) in row_text

        # The user also notices a form that enables the grid dimensions, start, and end nodes to be customized
        row_input = self.browser.find_element_by_id('rowInput')
        col_input = self.browser.find_element_by_id('colInput')
        start_row_input = self.browser.find_element_by_id('startRowInput')
        start_col_input = self.browser.find_element_by_id('startColInput')
        end_row_input = self.browser.find_element_by_id('endRowInput')
        end_col_input = self.browser.find_element_by_id('endColInput')
        submit_button = self.browser.find_element_by_id('submitButton')

        # The user enters a new grid size, start, and end points and submits the form. A new grid appears with the
        # correct dimensions, start, and end points
        num_rows, num_cols = 10, 10
        start_row, start_col = 2, 2
        end_row, end_col = 8, 8
        row_input.send_keys(str(num_rows))
        col_input.send_keys(str(num_cols))
        start_row_input.send_keys(str(start_row))
        start_col_input.send_keys(str(start_col))
        end_row_input.send_keys(str(end_row))
        end_col_input.send_keys(str(end_col))
        ActionChains(self.browser).move_to_element(submit_button).click().perform()

        self.wait_for_assert(
            lambda: len(self.browser.find_element_by_class_name('.node')) == num_rows * num_cols
        )
        self.wait_for_assert(
            lambda: self.browser.find_element_by_class_name('.startNode').id == self.make_node_id(
                start_row, start_col, num_cols
            )
        )
        self.wait_for_assert(
            lambda: self.browser.find_element_by_class_name('.endNode').id == self.make_node_id(
                end_row, end_col, num_cols
            )
        )

        # The user then clicks on an empty box in the grid and immediately sees it turn black.
        element = self.browser.get_element_by_id(self.make_node_id(5, 5, num_cols))
        ActionChains(self.browser).move_to_element(element).click().perform()
        self.wait_for_assert(lambda: element.props.style.backgroundColor == 'rgb(0,0,0)')

        # The user then clicks and holds down on an empty box in the grid and drags their mouse across multiple
        # boxes which causes each box to turn black
        elements = [self.browser.get_element_by_id(self.make_node_id(i, 4, num_cols)) for i in range(10)]
        ActionChains(self.browser).move_to_element(elements[0]).click_and_hold(
        ).move_to_element(elements[-1]).release().perform()
        for element in elements:
            self.wait_for_assert(lambda: element.props.style.backgroundColor == 'rgb(0,0,0)')

        # The user then clicks on a black box and sees it go back to white
        element = self.browser.get_element_by_id(self.make_node_id(5, 5, num_cols))
        ActionChains(self.browser).move_to_element(element).click().perform()
        self.wait_for_assert(lambda: element.props.style.backgroundColor == 'rgb(255,255,255)')

        # The user clicks and holds down on a black box and drags their mouse across more black boxes which then turn
        # back to white
        ActionChains(self.browser).move_to_element(elements[0]).click_and_hold(
        ).move_to_element(elements[-1]).release().perform()
        for element in elements:
            self.wait_for_assert(lambda: element.props.style.backgroundColor == 'rgb(255,255,255)')
