from time import sleep

from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from .base import TIMEOUT, BaseInputElement, BasePage


def make_form_input(row, col):
    return f'{row},{col}'


class DimensionsInputElement(BaseInputElement):
    locator = 'dimensionsInput'


class StartNodeInputElement(BaseInputElement):
    locator = 'startNodeInput'


class EndNodeInputElement(BaseInputElement):
    locator = 'endNodeInput'


class GridPage(BasePage):
    dims_input = DimensionsInputElement()
    start_node_input = StartNodeInputElement()
    end_node_input = EndNodeInputElement()

    def __init__(self, driver, num_rows=None, num_cols=None):
        super().__init__(driver)
        self.num_rows = None
        self.num_cols = None
        if num_rows and num_cols:
            self.dims_input = make_form_input(num_rows, num_cols)
            self.submit_grid_dims()
            self._calculate_grid_dimensions()

    def has_correct_title(self):
        return 'Path Finding Algorithm Visualizer' in self.driver.title

    def has_correct_header(self):
        return 'Path Finding Algorithm Visualizer' in self.driver.find_element_by_tag_name('h1').text

    def has_node_of_type(self, n_type):
        return len(self._get_grid().find_elements_by_class_name(f'node.{n_type}')) != 0

    def get_node(self, row, col):
        return self._get_grid().find_element_by_id(self._make_node_id(row, col))

    def is_grid_input_error_visible(self):
        return self.driver.find_element_by_id('gridErrorMessage').is_displayed()

    def is_algorithm_select_error_visible(self):
        return self.driver.find_element_by_id('algorithmSelectErrorMessage').is_displayed()

    def grid_has_dimensions(self, num_rows, num_cols):
        self._calculate_grid_dimensions()
        nodes = self._get_grid().find_elements_by_class_name('node')
        return self.num_rows == num_rows and self.num_cols == num_cols and len(nodes) == num_rows * num_cols

    def nodes_are_square(self):
        node = self._get_grid().find_elements_by_class_name('node')[0]
        width, height = self._extract_pixel_dimensions(node)
        return width == height

    def is_node_of_type(self, row, col, n_types):
        if row < 0 or col < 0 or row >= self.num_rows or col >= self.num_cols:
            return False

        grid = self._get_grid()
        if not isinstance(n_types, list):
            n_types = [n_types]

        bools = []
        class_list = grid.find_element_by_id(self._make_node_id(row, col)).get_attribute('class')

        for n_type in n_types:
            bools.append('node' in class_list and f'{n_type}' in class_list)

        return any(bools)

    def click_node(self, row, col):
        grid = self._get_grid()
        element = grid.find_element_by_id(self._make_node_id(row, col))
        element.click()

    def click_weight_node_toggle(self):
        self.driver.find_element_by_id('weightToggleLabel').click()
        return 'weight' if self.driver.find_element_by_id('weightToggle').get_attribute('checked') == 'true' else 'wall'

    def click_and_hold_nodes(self, start_row, start_col, end_row, end_col):
        grid = self._get_grid()
        start = grid.find_element_by_id(self._make_node_id(start_row, start_col))
        end = grid.find_element_by_id(self._make_node_id(end_row, end_col))
        actions = ActionChains(self.driver)
        actions.move_to_element(start).click_and_hold(
        ).move_by_offset(1, 1).move_to_element(end).release().perform()
        actions.reset_actions()

    def submit_grid_dims(self):
        self.driver.find_element_by_id('dimensionsInput').send_keys(Keys.ENTER)

    def click_run(self):
        self.driver.find_element_by_id('runButton').click()

    def click_reset(self):
        self.driver.find_element_by_id('resetButton').click()

    def click_reset_path(self):
        self.driver.find_element_by_id('resetPathButton').click()

    def wait_until_complete(self, timeout=None):
        WebDriverWait(self.driver, timeout or TIMEOUT).until(
            EC.visibility_of(self.driver.find_element_by_id('algComplete')))
        sleep(1)  # wait for animations

    def wait_for_node_to_be_of_type(self, row, col, n_types, timeout=None):
        if not isinstance(n_types, list):
            n_types = [n_types]
        WebDriverWait(self.driver, timeout or TIMEOUT).until(
            lambda x: any(self.is_node_of_type(row, col, n_type) for n_type in n_types)
        )

    def select_algorithm(self, algorithm):
        self._make_selection('algorithmSelect', algorithm)

    def get_cost(self):
        element = self.driver.find_element_by_id('cost')
        if element.is_displayed():
            return int(element.text)

        return None

    def can_select_heuristic(self, heuristic=None):
        element = self.driver.find_element_by_id('heuristicSelect')
        is_enabled = element.is_enabled()
        if not heuristic:
            return is_enabled

        return is_enabled and self._get_selection('heuristicSelect', heuristic)

    def select_heuristic(self, heuristic):
        self._make_selection('heuristicSelect', heuristic)

    def select_maze_generation(self, algorithm):
        self._make_selection('mazeGenerationSelect', algorithm)

    def toggle_diagonal_moves(self):
        element = self.driver.find_element_by_id('diagMovesToggle')
        element.click()
        return element.get_attribute('checked')

    def change_node_weights(self, value):
        element = self.driver.find_elements_by_class_name('slider-handle')[0]
        action = ActionChains(self.driver)
        action.click_and_hold(element).move_by_offset(-210, 0).release().perform()
        action.click_and_hold(element).move_by_offset(value * 9.6, 0).release().perform()

    def can_see_alg_info(self, algorithm):
        mapping = {
            "Dijkstra's Algorithm": 'dijkstraInfo',
            'Depth-First Search': 'dfsInfo',
            'Depth-First Search (Shortest Path)': 'dfsspInfo',
            'Breadth-First Search': 'bfsInfo',
            'A* Search': 'a*Info',
            'Greedy Best-First Search': 'greedy-bfsInfo',
            'Bidirectional Search': 'bidirectionalInfo'
        }
        return self.driver.find_element_by_id(mapping[algorithm]).is_displayed()

    def _get_grid(self):
        return self.driver.find_element_by_id('grid')

    def _extract_pixel_dimensions(self, element):
        return element.size['width'], element.size['height']

    def _make_node_id(self, row, col):
        if self.num_cols is None:
            self._calculate_grid_dimensions()
        return f'n{row * self.num_cols + col}'

    def _calculate_grid_dimensions(self):
        grid = self._get_grid()
        rows = grid.find_elements_by_tag_name('tr')
        cols = rows[0].find_elements_by_tag_name('td')
        self.num_rows = len(rows)
        self.num_cols = len(cols)

    def _make_selection(self, select_id, option_text):
        option = self._get_selection(select_id, option_text)
        if option is None:
            raise NoSuchElementException
        else:
            option.click()

    def _get_selection(self, select_id, option_text):
        dropdown = self.driver.find_element_by_css_selector(f'button[data-id={select_id}]')
        dropdown.click()
        for child in self.driver.find_elements_by_css_selector(f"ul[role=presentation] li a span"):
            if child.get_attribute('innerHTML') == option_text:
                return child
