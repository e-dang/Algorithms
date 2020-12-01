import pytest
from path_finding.views import DEFAULT_GRID_PARAMS as grid_params

from .pages.grid_page import GridPage


@pytest.mark.functional
@pytest.mark.usefixtures("driver_init")
class TestGrid:
    @pytest.fixture(autouse=True)
    def url(self):
        return 'http://localhost:8000/path-finding/'

    def assert_line_of_nodes_are_of_type(self, page, start, end, const, n_type, vertical=True):
        for i in range(start, end + 1):
            if vertical:
                assert page.is_node_of_type(i, const, n_type)
            else:
                assert page.is_node_of_type(const, i, n_type)

    def make_form_input(self, row, col):
        return f'{row},{col}'

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

        # The user also notices a form that enables the grid dimensions, start, and end nodes to be customized.
        # The user enters a new grid size, start, and end points and submits the form.
        rows, cols = 10, 11
        page.dims_input = self.make_form_input(rows, cols)
        page.click_submit()

        # A new grid appears with the correct dimensions, start, and end nodes
        assert page.grid_has_dimensions(rows, cols)
        assert page.nodes_are_square()
        assert page.has_node_of_type('start')
        assert page.has_node_of_type('end')

    def test_user_can_click_and_drag_start_and_end_nodes_to_reposition(self, url):
        # The user goes to the website
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

        # The user clicks and drags the start node to a new position and sees the start node move with the mouse
        begin_row, finish_row = grid_params['start_row'], grid_params['start_row'] + 5
        page.click_and_hold_nodes(begin_row, grid_params['start_col'], finish_row, grid_params['start_col'])
        self.assert_line_of_nodes_are_of_type(page, begin_row, finish_row - 1, grid_params['start_col'], 'empty')
        assert page.is_node_of_type(finish_row, grid_params['start_col'], 'start')

        # The user then clicks the old start node position and sees it turn into a wall node
        page.click_node(grid_params['start_row'], grid_params['start_col'])
        assert page.is_node_of_type(grid_params['start_row'], grid_params['start_col'], 'wall')

        # The user then clicks the new start node, but it remains a start node
        page.click_node(finish_row, grid_params['start_col'])
        assert page.is_node_of_type(finish_row, grid_params['start_col'], 'start')

        # The user clicks and drags the end node to a new position and sees the start node move with the mouse
        begin_row, finish_row = grid_params['end_row'], grid_params['end_row'] - 5
        page.click_and_hold_nodes(begin_row, grid_params['end_col'], finish_row, grid_params['end_col'])
        self.assert_line_of_nodes_are_of_type(page, begin_row, finish_row + 1, grid_params['end_col'], 'empty')
        assert page.is_node_of_type(finish_row, grid_params['end_col'], 'end')

        # The user then clicks the old end node position and sees it turn into a wall node
        page.click_node(grid_params['end_row'], grid_params['end_col'])
        assert page.is_node_of_type(grid_params['end_row'], grid_params['end_col'], 'wall')

        # The user then clicks the new end node, but it remains an end node
        page.click_node(finish_row, grid_params['end_col'])
        assert page.is_node_of_type(finish_row, grid_params['end_col'], 'end')

        # The user clicks and drags on the virtical edge of the grid and sees the grid resize horizontally
        assert False, 'finish the test!'

        # The user clicks and drags on the horizontal edge of the grid and sees the grid resize vertically

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

        # The user then clicks the start node and sees that it does not change
        page.click_node(grid_params['start_row'], grid_params['start_col'])
        assert page.is_node_of_type(grid_params['start_row'], grid_params['start_col'], 'start')

        # The user then clicks the end node and sees that it does not change
        page.click_node(grid_params['end_row'], grid_params['end_col'])
        assert page.is_node_of_type(grid_params['end_row'], grid_params['end_col'], 'end')

    def test_user_can_select_different_algorithms_and_run_them(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # Resize the grid to something small so the test runs faster
        dims, start, end = 10, 1, 8  # start and end are known from scaling calculation in js
        page.dims_input = self.make_form_input(dims, dims)
        page.click_submit()

        # The user notices a drop down menu to select algorithms to visualize and selects Dijkstra's algorithm
        page.select_algorithm("Dijkstra's Algorithm")

        # The user clicks and drags on some empty nodes and converts them to wall nodes
        w_start_row, w_end_row, col = 3, 8, 5
        page.click_and_hold_nodes(w_start_row, col, w_end_row, col)
        self.assert_line_of_nodes_are_of_type(page, w_start_row, w_end_row, col, 'wall')

        # The user sees a button that runs the algorithm on the grid and presses it
        page.click_run()

        # The algorithm runs and the user sees explored nodes around the start node
        assert page.is_node_of_type(start + 1, start, 'visited')

        # The algorithm completes and the user sees path nodes at the start and end nodes
        page.wait_until_complete()
        movements = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]
        assert any(page.is_node_of_type(start + dr, start + dc, 'path') for dr, dc in movements)
        assert any(page.is_node_of_type(end + dr, end + dc, 'path') for dr, dc in movements)

        # The user also notices that the wall nodes have not been changed either
        self.assert_line_of_nodes_are_of_type(page, w_start_row, w_end_row, col, 'wall')

        # The user sees a button to reset the graph and clicks it. The grid resets.
        page.click_reset()
        for row in range(dims):
            for col in range(dims):
                if row == start and col == start:
                    assert page.is_node_of_type(row, col, 'start')
                elif row == end and col == end:
                    assert page.is_node_of_type(row, col, 'end')
                else:
                    assert page.is_node_of_type(row, col, 'empty')
