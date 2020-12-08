import os

import pytest
from path_finding.views import DEFAULT_GRID_PARAMS as grid_params

from .pages.grid_page import GridPage

GRID_PROPS = (10, 1, 8)
WALL_NODES = (3, 8, 5)


@pytest.mark.functional
@pytest.mark.usefixtures("driver_init")
class TestGrid:
    @pytest.fixture(autouse=True)
    def url(self, live_server):
        staging_server = os.environ.get('STAGING_SERVER')
        if staging_server:
            return 'http://' + staging_server + '/path-finding/'
        else:
            return live_server.url + '/path-finding/'

    def assert_line_of_nodes_are_of_type(self, page, start, end, const, n_type, vertical=True):
        for i in range(start, end + 1):
            if vertical:
                assert page.is_node_of_type(i, const, n_type)
            else:
                assert page.is_node_of_type(const, i, n_type)

    def make_form_input(self, row, col):
        return f'{row},{col}'

    def test_user_can_customize_grid_through_input_field(self, url):
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

        # The user also notices a form that enables the grid dimensions to be customized.
        # The user enters a new grid size and submits the form.
        rows, cols = 10, 11
        page.dims_input = self.make_form_input(rows, cols)
        page.click_submit()

        # A new grid appears with the correct dimensions
        assert page.grid_has_dimensions(rows, cols)
        assert page.nodes_are_square()
        assert page.has_node_of_type('start')
        assert page.has_node_of_type('end')

        # The user then tries to input negative numbers for the dimensions
        invalid_rows, invalid_cols = -1, -1
        page.dims_input = self.make_form_input(invalid_rows, invalid_cols)
        page.click_submit()

        # The user sees an error message about invalid input
        assert page.is_grid_input_error_visible()

        # The user begins typing in the input and sees the error message disappear
        page.dims_input = '1'
        assert not page.is_grid_input_error_visible()

    def test_user_can_click_and_drag_start_and_end_nodes_to_reposition(self, url):
        # The user goes to the website
        self.driver.get(url)
        page = GridPage(self.driver)

        # The user clicks and drags the start node to a new position and sees the start node move with the mouse
        start_begin_row, start_finish_row = grid_params['start_row'], grid_params['start_row'] + 5
        page.click_and_hold_nodes(start_begin_row, grid_params['start_col'], start_finish_row, grid_params['start_col'])
        self.assert_line_of_nodes_are_of_type(
            page, start_begin_row, start_finish_row - 1, grid_params['start_col'], 'empty')
        assert page.is_node_of_type(start_finish_row, grid_params['start_col'], 'start')

        # The user then clicks the old start node position and sees it turn into a wall node
        page.click_node(grid_params['start_row'], grid_params['start_col'])
        assert page.is_node_of_type(grid_params['start_row'], grid_params['start_col'], 'wall')

        # The user then clicks the new start node, but it remains a start node
        page.click_node(start_finish_row, grid_params['start_col'])
        assert page.is_node_of_type(start_finish_row, grid_params['start_col'], 'start')

        # The user clicks and drags the end node to a new position and sees the start node move with the mouse
        end_begin_row, end_finish_row = grid_params['end_row'], grid_params['end_row'] - 5
        page.click_and_hold_nodes(end_begin_row, grid_params['end_col'], end_finish_row, grid_params['end_col'])
        self.assert_line_of_nodes_are_of_type(page, end_begin_row, end_finish_row + 1, grid_params['end_col'], 'empty')
        assert page.is_node_of_type(end_finish_row, grid_params['end_col'], 'end')

        # The user then clicks the old end node position and sees it turn into a wall node
        page.click_node(grid_params['end_row'], grid_params['end_col'])
        assert page.is_node_of_type(grid_params['end_row'], grid_params['end_col'], 'wall')

        # The user then clicks the new end node, but it remains an end node
        page.click_node(end_finish_row, grid_params['end_col'])
        assert page.is_node_of_type(end_finish_row, grid_params['end_col'], 'end')

        # The user then drags the start node onto the end node but doesnt see the end node change
        page.click_and_hold_nodes(start_finish_row, grid_params['start_col'], end_finish_row, grid_params['end_col'])
        assert page.is_node_of_type(end_finish_row, grid_params['end_col'], 'end')

    def test_user_can_change_node_types_between_wall_and_empty(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver, grid_params['num_rows'], grid_params['num_cols'])

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

    def test_user_cant_run_algorithm_when_none_are_selected(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # The user immediately presses run but an error shows up telling the user to select an algorithm
        page.click_run()
        assert page.is_algorithm_select_error_visible()

        # The user then clicks on the selection drop down menu and the error disappears
        page.select_algorithm("Dijkstra's Algorithm")

        assert not page.is_algorithm_select_error_visible()

    @pytest.mark.parametrize('url, algorithm, grid_props, wall_nodes, cost', [
        (None, "Dijkstra's Algorithm", GRID_PROPS, WALL_NODES, 10),
        (None, 'Depth-First Search', GRID_PROPS, WALL_NODES, 82),
        (None, 'Depth-First Search (Shortest Path)', (3, 0, 2), (1, 2, 1), 3),
        (None, 'Breadth-First Search', GRID_PROPS, WALL_NODES, 10),
        (None, 'A* Search', GRID_PROPS, WALL_NODES, 10),
        (None, 'Greedy Best-First Search', GRID_PROPS, WALL_NODES, 11),
        (None, 'Bidirectional Search', GRID_PROPS, WALL_NODES, 10),
    ],
        indirect=['url'],
        ids=['dijkstra', 'dfs', 'dfssp', 'bfs', 'a*', 'greedy-bfs', 'bidirectional'])
    def test_user_can_select_different_algorithms_and_run_them(self, url, algorithm, grid_props, wall_nodes, cost):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # Resize the grid to something small so the test runs faster
        dims, start, end = grid_props  # start and end are known from scaling calculation in js
        page.dims_input = self.make_form_input(dims, dims)
        page.click_submit()

        # The user notices a drop down menu to select algorithms to visualize and selects Dijkstra's algorithm
        page.select_algorithm(algorithm)

        # The user clicks and drags on some empty nodes and converts them to wall nodes
        w_start_row, w_end_row, col = wall_nodes
        page.click_and_hold_nodes(w_start_row, col, w_end_row, col)
        self.assert_line_of_nodes_are_of_type(page, w_start_row, w_end_row, col, 'wall')

        # The user sees a button that runs the algorithm on the grid and presses it
        page.click_run()

        # The algorithm runs and the user sees explored nodes around the start node
        page.wait_for_node_to_be_of_type(start + 1, start, ['visited', 'visiting'], timeout=5)

        # The algorithm completes and the user sees path nodes at the start and end nodes, along with the path cost
        page.wait_until_complete()
        movements = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]
        assert any(page.is_node_of_type(start + dr, start + dc, 'path') for dr, dc in movements)
        assert any(page.is_node_of_type(end + dr, end + dc, 'path') for dr, dc in movements)
        assert page.get_cost() == cost

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

    def test_user_can_reset_path_but_maintain_wall_nodes(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # Resize the grid to something small so the test runs faster
        dims, start, end = GRID_PROPS  # start and end are known from scaling calculation in js
        page.dims_input = self.make_form_input(dims, dims)
        page.click_submit()

        # The user notices a drop down menu to select algorithms to visualize and selects Dijkstra's algorithm
        page.select_algorithm('Greedy Best-First Search')

        # The user clicks and drags on some empty nodes and converts them to wall nodes
        w_start_row, w_end_row, col = WALL_NODES
        page.click_and_hold_nodes(w_start_row, col, w_end_row, col)
        self.assert_line_of_nodes_are_of_type(page, w_start_row, w_end_row, col, 'wall')

        # The user sees a button that runs the algorithm on the grid and presses it
        page.click_run()
        page.wait_until_complete()

        # The user sees a button to reset the path on the graph and clicks it. The path is now gone but the wall
        # nodes remain.
        page.click_reset_path()
        for row in range(dims):
            for col in range(dims):
                if row == start and col == start:
                    assert page.is_node_of_type(row, col, 'start')
                elif row == end and col == end:
                    assert page.is_node_of_type(row, col, 'end')
                else:
                    assert page.is_node_of_type(row, col, ['empty', 'wall'])
