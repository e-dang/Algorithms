import pytest
from path_finding.views import DEFAULT_GRID_PARAMS as grid_params
from selenium import webdriver

from .pages.grid_page import GridPage


@pytest.fixture(params=['firefox'], scope="class")
def driver_init(request):
    request.cls.driver = webdriver.Firefox()

    yield

    request.cls.driver.quit()


@pytest.mark.functional
@pytest.mark.usefixtures("driver_init")
class TestGrid:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:8000/path-finding/'

    def test_user_can_customize_grid_through_input_fields(self, url):
        # A user goes to the website
        self.driver.get(url)
        page = GridPage(self.driver)

        # The user notices the page title and header mention path finding algorithms
        assert page.has_correct_title()
        assert page.has_correct_header()

        # A grid of squares is visible on the page, with start and end nodes
        assert page.grid_has_dimensions(grid_params['num_rows'], grid_params['num_cols'])
        assert page.nodes_are_square()
        assert page.is_node_of_type(grid_params['start_row'], grid_params['start_col'], 'start')
        assert page.is_node_of_type(grid_params['end_row'], grid_params['end_col'], 'end')

        # There is also information about the grid's dimensions and locations of the start and end nodes
        assert page.table_displays_dimensions(grid_params['num_rows'], grid_params['num_cols'])
        assert page.table_displays_start_node_coords(grid_params['start_row'], grid_params['start_col'])
        assert page.table_displays_end_node_coords(grid_params['end_row'], grid_params['end_col'])

        # The user also notices a form that enables the grid dimensions, start, and end nodes to be customized.
        # The user enters a new grid size, start, and end points and submits the form.
        dims, start, end = 10, 2, 7
        page.dims_input = f'{dims},{dims}'
        page.start_node_input = f'{start},{start}'
        page.end_node_input = f'{end},{end}'
        page.click_submit()

        # A new grid appears with the correct dimensions, start, and end nodes
        assert page.grid_has_dimensions(dims, dims)
        assert page.nodes_are_square()
        assert page.is_node_of_type(start, start, 'start')
        assert page.is_node_of_type(end, end, 'end')

        # The table now displays the correct information about the updated grid
        assert page.table_displays_dimensions(dims, dims)
        assert page.table_displays_start_node_coords(start, start)
        assert page.table_displays_end_node_coords(end, end)

    def test_user_can_change_node_types_between_wall_and_empty(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # The user clicks on an empty node in the grid and immediately sees it turn to a wall node.
        row, col = 5, 5
        assert page.is_node_of_type(row, col, 'empty')
        page.click_node(row, col)
        assert page.is_node_of_type(row, col, 'wall')

        # The user clicks on the node again and sees it go back to an empty node
        page.click_node(row, col)
        assert page.is_node_of_type(row, col, 'empty')

        # The user then clicks and holds down on an empty node in the grid and drags their mouse across multiple
        # nodes which causes each node to turn black
        start_row, end_row, col = 0, 10, 4
        for i in range(start_row, end_row + 1):
            assert page.is_node_of_type(i, col, 'empty')
        page.click_and_hold_nodes(start_row, col, end_row, col)
        for i in range(start_row, end_row + 1):
            assert page.is_node_of_type(i, col, 'wall')

        # The user clicks and holds down on a wall node and drags their mouse across more wall nodes which then turn
        # back to empty nodes
        page.click_and_hold_nodes(start_row, col, end_row, col)
        for i in range(start_row, end_row + 1):
            assert page.is_node_of_type(i, col, 'empty')
