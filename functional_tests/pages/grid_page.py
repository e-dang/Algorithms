
from selenium.webdriver.common.action_chains import ActionChains
from .base import BaseInputElement, BasePage


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

    def __init__(self, driver):
        super().__init__(driver)
        self.num_rows = None
        self.num_cols = None

    def has_correct_title(self):
        return 'Path Finding Algorithms' in self.driver.title

    def has_correct_header(self):
        return 'Path Finding Algorithms' in self.driver.find_element_by_tag_name('h1').text

    def grid_has_dimensions(self, num_rows, num_cols):
        self._calculate_grid_dimensions()
        nodes = self._get_grid().find_elements_by_class_name('node')
        return self.num_rows == num_rows and self.num_cols == num_cols and len(nodes) == num_rows * num_cols

    def nodes_are_square(self):
        node = self._get_grid().find_elements_by_class_name('node')[0]
        width, height = self._extract_pixel_dimensions(node)
        return width == height

    def is_node_of_type(self, row, col, n_type):
        grid = self._get_grid()
        return grid.find_element_by_id(self._make_node_id(row, col)).get_attribute('class') == f'node {n_type}'

    def table_displays_dimensions(self, num_rows, num_cols):
        row_text = self._get_table_row_text()
        return 'Dimensions {} {}'.format(num_rows, num_cols) in row_text

    def table_displays_start_node_coords(self, row, col):
        row_text = self._get_table_row_text()
        return 'Start Node {} {}'.format(row, col) in row_text

    def table_displays_end_node_coords(self, row, col):
        row_text = self._get_table_row_text()
        return 'End Node {} {}'.format(row, col) in row_text

    def click_node(self, row, col):
        grid = self._get_grid()
        element = grid.find_element_by_id(self._make_node_id(row, col))
        element.click()

    def click_and_hold_nodes(self, start_row, start_col, end_row, end_col):
        grid = self._get_grid()
        start = grid.find_element_by_id(self._make_node_id(start_row, start_col))
        end = grid.find_element_by_id(self._make_node_id(end_row, end_col))
        actions = ActionChains(self.driver)
        actions.move_to_element(start).click_and_hold(
        ).move_by_offset(1, 1).move_to_element(end).release().perform()
        actions.reset_actions()

    def click_submit(self):
        submit_button = self.driver.find_element_by_id('submitButton')
        submit_button.click()
        self._calculate_grid_dimensions()

    def _get_grid(self):
        return self.driver.find_element_by_id('grid')

    def _extract_pixel_dimensions(self, element):
        width = int(element.value_of_css_property('width')[:-2])
        height = int(element.value_of_css_property('height')[:-2])
        return width, height

    def _get_table_row_text(self):
        table = self.driver.find_element_by_id('gridInfo')
        return [row.text for row in table.find_elements_by_tag_name('tr')]

    def _make_node_id(self, row, col):
        if self.num_cols is None:
            self._calculate_grid_dimensions()
        return f'n{row * self.num_cols + col}'

    def _calculate_grid_dimensions(self):
        grid = self._get_grid()
        g_width, g_height = self._extract_pixel_dimensions(grid)
        node = grid.find_elements_by_class_name('node')[0]
        n_widths, n_heights = self._extract_pixel_dimensions(node)

        # add 1 for border widths
        self.num_rows = g_height // (n_heights + 1)
        self.num_cols = g_width // (n_widths + 1)
