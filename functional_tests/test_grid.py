import os
from math import ceil

import pytest

from .pages.grid_page import GridPage, make_form_input


def calc_start_pos(num_rows, num_cols):
    return int(num_rows * 0.1), int(num_cols * 0.1)


def calc_end_pos(num_rows, num_cols):
    return ceil(num_rows * 0.9) - 1, ceil(num_cols * 0.9) - 1


GRID_PROPS = (10, 1, 8)
WALL_NODES = (3, 8, 5)
WEIGHT_NODES = (0, 9, 5)
NUM_ROWS = 40
NUM_COLS = 40
START_ROW, START_COL = calc_start_pos(NUM_ROWS, NUM_COLS)
END_ROW, END_COL = calc_end_pos(NUM_ROWS, NUM_COLS)


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

    def run_algorithm_test_case(self, page, algorithm, grid_props, wall_nodes, cost):
        # Resize the grid to something small so the test runs faster
        dims, start, end = grid_props  # start and end are known from scaling calculation in js
        page.dims_input = make_form_input(dims, dims)
        page.submit_grid_dims()

        # The user notices a drop down menu to select algorithms to visualize and selects an algorithm
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

    def test_user_can_customize_grid_through_input_field(self, url):
        # A user goes to the website
        self.driver.get(url)
        page = GridPage(self.driver)

        # The user notices the page title and header mention path finding algorithms
        assert page.has_correct_title()
        assert page.has_correct_header()

        # A grid of squares is visible on the page, with start and end nodes
        assert page.nodes_are_square()
        assert page.has_node_of_type('start')
        assert page.has_node_of_type('end')

        # The user also notices a form that enables the grid dimensions to be customized.
        # The user enters a new grid size and submits the form.
        rows, cols = 10, 11
        page.dims_input = make_form_input(rows, cols)
        page.submit_grid_dims()

        # A new grid appears with the correct dimensions
        assert page.grid_has_dimensions(rows, cols)
        assert page.nodes_are_square()
        assert page.has_node_of_type('start')
        assert page.has_node_of_type('end')

        # The user then tries to input negative numbers for the dimensions
        invalid_rows, invalid_cols = -1, -1
        page.dims_input = make_form_input(invalid_rows, invalid_cols)
        page.submit_grid_dims()

        # The user sees an error message about invalid input
        assert page.is_grid_input_error_visible()

        # The user begins typing in the input and sees the error message disappear
        page.dims_input = '1'
        assert not page.is_grid_input_error_visible()

    def test_user_can_click_and_drag_start_and_end_nodes_to_reposition(self, url):
        # The user goes to the website
        self.driver.get(url)
        page = GridPage(self.driver, NUM_ROWS, NUM_COLS)

        # The user clicks and drags the start node to a new position and sees the start node move with the mouse
        start_begin_row, start_finish_row = START_ROW, START_ROW + 5
        page.click_and_hold_nodes(start_begin_row, START_COL, start_finish_row, START_COL)
        self.assert_line_of_nodes_are_of_type(
            page, start_begin_row, start_finish_row - 1, START_COL, 'empty')
        assert page.is_node_of_type(start_finish_row, START_COL, 'start')

        # The user then clicks the old start node position and sees it turn into a wall node
        page.click_node(START_ROW, START_COL)
        assert page.is_node_of_type(START_ROW, START_COL, 'wall')

        # The user then clicks the new start node, but it remains a start node
        page.click_node(start_finish_row, START_COL)
        assert page.is_node_of_type(start_finish_row, START_COL, 'start')

        # The user clicks and drags the end node to a new position and sees the start node move with the mouse
        end_begin_row, end_finish_row = END_ROW, END_ROW - 5
        page.click_and_hold_nodes(end_begin_row, END_COL, end_finish_row, END_COL)
        self.assert_line_of_nodes_are_of_type(page, end_begin_row, end_finish_row + 1, END_COL, 'empty')
        assert page.is_node_of_type(end_finish_row, END_COL, 'end')

        # The user then clicks the old end node position and sees it turn into a wall node
        page.click_node(END_ROW, END_COL)
        assert page.is_node_of_type(END_ROW, END_COL, 'wall')

        # The user then clicks the new end node, but it remains an end node
        page.click_node(end_finish_row, END_COL)
        assert page.is_node_of_type(end_finish_row, END_COL, 'end')

        # The user then drags the start node onto the end node but doesnt see the end node change
        page.click_and_hold_nodes(start_finish_row, START_COL, end_finish_row, END_COL)
        assert page.is_node_of_type(end_finish_row, END_COL, 'end')

    @pytest.mark.parametrize('url, n_type', [
        (None, 'wall'),
        (None, 'weight')
    ],
        indirect=['url'],
        ids=['wall', 'weight'])
    def test_user_can_change_node_types_between_wall_or_weight_and_empty(self, url, n_type):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver, NUM_ROWS, NUM_COLS)

        # If n_type is weight, then toggle to weight node
        if n_type == 'weight':
            assert n_type == page.click_weight_node_toggle()

        # The user clicks on an empty node in the grid and immediately sees it change to n_type.
        row, col = 10, 10
        assert page.is_node_of_type(row, col, 'empty')
        page.click_node(row, col)
        assert page.is_node_of_type(row, col, n_type)

        # The user clicks on the node again and sees it go back to an empty node
        page.click_node(row, col)
        assert page.is_node_of_type(row, col, 'empty')

        # The user then clicks and holds down on an empty node in the grid and drags their mouse across multiple
        # nodes which causes each node to turn to n_type
        start_row, end_row, col = 0, 10, 10
        for i in range(start_row, end_row + 1):
            assert page.is_node_of_type(i, col, 'empty')
        page.click_and_hold_nodes(start_row, col, end_row, col)
        for i in range(start_row, end_row + 1):
            assert page.is_node_of_type(i, col, n_type)

        # The user clicks and holds down on a n_type node and drags their mouse across more n_type nodes which then turn
        # back to empty nodes
        page.click_and_hold_nodes(start_row, col, end_row, col)
        for i in range(start_row, end_row + 1):
            assert page.is_node_of_type(i, col, 'empty')

        # The user then clicks the start node and sees that it does not change
        page.click_node(START_ROW, START_COL)
        assert page.is_node_of_type(START_ROW, START_COL, 'start')

        # The user then clicks the end node and sees that it does not change
        page.click_node(END_ROW, END_COL)
        assert page.is_node_of_type(END_ROW, END_COL, 'end')

    @pytest.mark.parametrize('url, from_n_type, to_n_type', [
        (None, 'wall', 'weight'),
        (None, 'weight', 'wall')
    ],
        indirect=['url'],
        ids=['wall-weight', 'weight-wall'])
    def test_user_can_directly_interchange_wall_and_weight_nodes(self, url, from_n_type, to_n_type):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver, NUM_ROWS, NUM_COLS)

        if from_n_type == 'weight':
            assert from_n_type == page.click_weight_node_toggle()

        # The user clicks on an empty node in the grid and immediately sees it change to from_n_type.
        row, col = 10, 10
        page.click_node(row, col)
        assert page.is_node_of_type(row, col, from_n_type)

        # The user then toggles to to_n_type and clicks the same node and sees it change to to_n_type
        assert to_n_type == page.click_weight_node_toggle()
        page.click_node(row, col)
        assert page.is_node_of_type(row, col, to_n_type)

        # The user then toggles back to from_n_type and holds down on a node and drags the mouse across more nodes. Each
        # node now changes to from_n_type
        assert from_n_type == page.click_weight_node_toggle()
        start_row, end_row, col = 0, 9, 10
        page.click_and_hold_nodes(start_row, col, end_row, col)
        for i in range(start_row, end_row + 1):
            assert page.is_node_of_type(i, col, from_n_type)

        # The user then toggles back to to_n_type and holds down on a node and drags the mouse across more nodes. Each
        # node now changes to to_n_type
        assert to_n_type == page.click_weight_node_toggle()
        page.click_and_hold_nodes(start_row, col, end_row, col)
        for i in range(start_row, end_row + 1):
            assert page.is_node_of_type(i, col, to_n_type)

    def test_user_cant_run_algorithm_when_none_are_selected(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver, NUM_ROWS, NUM_COLS)

        # The user immediately presses run but an error shows up telling the user to select an algorithm
        page.click_run()
        assert page.is_algorithm_select_error_visible()

        # The user then clicks on the selection drop down menu and the error disappears
        page.select_algorithm("Dijkstra's Algorithm")

        assert not page.is_algorithm_select_error_visible()

        # The user then presses run and the algorithm begins to run
        page.click_run()
        page.wait_for_node_to_be_of_type(START_ROW + 1,
                                         START_COL, ['visited', 'visiting'], timeout=5)

    @pytest.mark.parametrize('url, algorithm, grid_props, wall_nodes, cost', [
        (None, "Dijkstra's Algorithm", GRID_PROPS, WALL_NODES, 14),
        (None, 'Depth-First Search', GRID_PROPS, WALL_NODES, 82),
        (None, 'Depth-First Search (Shortest Path)', (3, 0, 2), (1, 2, 1), 4),
        (None, 'Breadth-First Search', GRID_PROPS, WALL_NODES, 14),
        (None, 'A* Search', GRID_PROPS, WALL_NODES, 14),
        (None, 'Greedy Best-First Search', GRID_PROPS, WALL_NODES, 14),
        (None, 'Bidirectional Search', GRID_PROPS, WALL_NODES, 14),
    ],
        indirect=['url'],
        ids=['dijkstra', 'dfs', 'dfssp', 'bfs', 'a*', 'greedy-bfs', 'bidirectional'])
    def test_user_can_select_different_algorithms_and_run_them_with_manhattan_moves(self, url, algorithm, grid_props, wall_nodes, cost):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        self.run_algorithm_test_case(page, algorithm, grid_props, wall_nodes, cost)

    @pytest.mark.parametrize('url, algorithm, grid_props, wall_nodes, cost', [
        (None, "Dijkstra's Algorithm", GRID_PROPS, WALL_NODES, 10),
        (None, 'Depth-First Search', GRID_PROPS, WALL_NODES, 81),
        (None, 'Depth-First Search (Shortest Path)', (3, 0, 2), (1, 2, 1), 3),
        (None, 'Breadth-First Search', GRID_PROPS, WALL_NODES, 10),
        (None, 'A* Search', GRID_PROPS, WALL_NODES, 10),
        (None, 'Greedy Best-First Search', GRID_PROPS, WALL_NODES, 11),
        (None, 'Bidirectional Search', GRID_PROPS, WALL_NODES, 10),
    ],
        indirect=['url'],
        ids=['dijkstra', 'dfs', 'dfssp', 'bfs', 'a*', 'greedy-bfs', 'bidirectional'])
    def test_user_can_select_different_algorithms_and_run_them_with_diagonal_moves(self, url, algorithm, grid_props, wall_nodes, cost):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # The user sees a check box to enable diagonal moves and clicks it
        page.toggle_diagonal_moves()

        self.run_algorithm_test_case(page, algorithm, grid_props, wall_nodes, cost)

    @pytest.mark.parametrize('url, algorithm', [
        (None, 'Greedy Best-First Search'),
        (None, 'A* Search')
    ],
        indirect=['url'],
        ids=['greedy-bfs', 'a*'])
    def test_user_cant_select_manhattan_heuristic_when_diagonal_moves_enabled(self, url, algorithm):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # The user sees a check box to enable diagonal moves and clicks it
        is_checked = page.toggle_diagonal_moves()
        assert is_checked

        # The user notices a drop down menu to select algorithms to visualize and selects an algorithm
        page.select_algorithm(algorithm)

        # The dropdown menu for choosing heuristic is now enabled, but the user can only select euclidean distance
        assert not page.can_select_heuristic('Manhattan Distance')
        assert page.can_select_heuristic('Euclidean Distance')

        # The user then unchecks the diagonal moves box
        is_checked = page.toggle_diagonal_moves()
        assert not is_checked

        # And the user is now able to select either Manhattan Distance or Euclidean Distance
        assert page.can_select_heuristic('Manhattan Distance')
        assert page.can_select_heuristic('Euclidean Distance')

    def test_weight_nodes_are_calculated_in_path_cost(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # Resize the grid to something small so the test runs faster
        dims, start, end = GRID_PROPS  # start and end are known from scaling calculation in js
        page.dims_input = make_form_input(dims, dims)
        page.submit_grid_dims()

        # The user notices a drop down menu to select algorithms to visualize and selects an algorithm
        page.select_algorithm('A* Search')

        # The user clicks and drags on some empty nodes and converts them to weight nodes
        w_start_row, w_end_row, col = WEIGHT_NODES
        assert page.click_weight_node_toggle() == 'weight'
        page.click_and_hold_nodes(w_start_row, col, w_end_row, col)
        self.assert_line_of_nodes_are_of_type(page, w_start_row, w_end_row, col, 'weight')

        # The user sees a button that runs the algorithm on the grid and presses it
        page.click_run()

        # The algorithm runs and the user sees explored nodes around the start node
        page.wait_for_node_to_be_of_type(start + 1, start, ['visited', 'visiting'], timeout=5)

        # The algorithm completes and the user sees path nodes at the start and end nodes, along with the path cost
        page.wait_until_complete()
        movements = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]
        assert any(page.is_node_of_type(start + dr, start + dc, 'path') for dr, dc in movements)
        assert any(page.is_node_of_type(end + dr, end + dc, 'path') for dr, dc in movements)
        assert page.get_cost() == 18

    @pytest.mark.parametrize('url, obstacle_nodes, n_type', [
        (None, WALL_NODES, 'wall'),
        (None, WEIGHT_NODES, 'weight')
    ],
        indirect=['url'],
        ids=['wall', 'weight'])
    def test_user_can_reset_path_but_maintain_wall_and_weight_nodes(self, url, obstacle_nodes, n_type):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver)

        # Resize the grid to something small so the test runs faster
        dims, *_ = GRID_PROPS  # start and end are known from scaling calculation in js
        page.dims_input = make_form_input(dims, dims)
        page.submit_grid_dims()

        # The user notices a drop down menu to select algorithms to visualize and selects Greedy Best-First Search
        page.select_algorithm('Greedy Best-First Search')

        # The user clicks and drags on some empty nodes and converts them to n_type
        if n_type == 'weight':
            assert n_type == page.click_weight_node_toggle()
        w_start_row, w_end_row, col = obstacle_nodes
        page.click_and_hold_nodes(w_start_row, col, w_end_row, col)
        self.assert_line_of_nodes_are_of_type(page, w_start_row, w_end_row, col, n_type)

        # The user sees a button that runs the algorithm on the grid and presses it
        page.click_run()
        page.wait_until_complete()

        # The user sees a button to reset the path on the graph and clicks it. The path is now gone but the n_type
        # nodes remain.
        page.click_reset_path()
        self.assert_line_of_nodes_are_of_type(page, w_start_row, w_end_row, col, n_type)

    def test_user_cannot_update_grid_or_reset_while_algorithm_is_running(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver, NUM_ROWS, NUM_COLS)

        # The user notices a drop down menu to select algorithms to visualize and selects A* Search and
        # runs it
        page.select_algorithm('A* Search')
        page.click_run()

        # The user then tries to add wall nodes during the current run, but does not see them change
        w_start_row, w_end_row, col = START_ROW + 5, START_ROW + 8, START_COL - 3
        page.click_node(w_start_row, col)
        assert not page.is_node_of_type(w_start_row, col, 'wall')

        page.click_and_hold_nodes(w_start_row, col, w_end_row, col)
        self.assert_line_of_nodes_are_of_type(page, w_start_row, w_end_row, col, 'empty')

        # The user then tries to click the reset buttons, but the algorithm continues to run
        page.click_reset()
        page.wait_for_node_to_be_of_type(START_ROW + 1,
                                         START_COL, ['visited', 'visiting'], timeout=5)

        page.click_reset_path()
        page.wait_for_node_to_be_of_type(START_ROW + 1,
                                         START_COL, ['visited', 'visiting'], timeout=5)

        # The user then tries to enter new grid dimensions, but again the algorithm continues to run
        dims = 10
        page.dims_input = make_form_input(dims, dims)
        assert not page.grid_has_dimensions(dims, dims)
        page.wait_for_node_to_be_of_type(START_ROW + 1,
                                         START_COL, ['visited', 'visiting'], timeout=5)

        # The algorithm then completes normally and the user sees a path
        page.wait_until_complete()
        movements = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]
        assert any(page.is_node_of_type(START_ROW + dr, START_COL + dc, 'path') for dr, dc in movements)
        assert any(page.is_node_of_type(END_ROW + dr, END_COL + dc, 'path') for dr, dc in movements)
        assert page.get_cost()

    def test_user_can_select_heuristic_function(self, url):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver, NUM_ROWS, NUM_COLS)

        # The user notices a drop down menue to select an algorithm and selects Breadth-First Search
        page.select_algorithm('Breadth-First Search')

        # The user doesn't see an option for selecting a heuristic
        assert not page.can_select_heuristic()

        # The user then selects the A* Search algorithm and now sees the option to select a heuristic
        page.select_algorithm('A* Search')
        assert page.can_select_heuristic()

        # The user selects a heuristic
        page.select_heuristic('Manhattan Distance')

        # The user then runs the algorithm and waits for it to complete. They see that the heuristic has been used.
        page.click_run()
        page.wait_until_complete()
        assert page.get_cost() == 62

    @pytest.mark.parametrize('url, alg, n_type', [
        (None, 'Randomized DFS', 'wall'),
        (None, 'Randomized Prim\'s Algorithm', 'wall'),
        (None, 'Random Walls', 'wall'),
        (None, 'Random Weights', 'weight'),
        (None, 'Recursive Division (Walls)', 'wall'),
        (None, 'Recursive Division (Weights)', 'weight')
    ],
        indirect=['url'],
        ids=['dfs', 'prims', 'random-walls', 'random-weights', 'recursive-walls', 'recursive-weights'])
    def test_user_can_generate_maze(self, url, alg, n_type):
        # The user goes to the website and sees a grid
        self.driver.get(url)
        page = GridPage(self.driver, NUM_ROWS, NUM_COLS)

        # The user notices a drop down menu to generate mazes and selects Randomized DFS
        page.select_maze_generation(alg)

        # The user sees a maze being generated
        obstacles_have_been_generated = False
        for i in range(NUM_ROWS):
            for j in range(NUM_COLS):
                if page.is_node_of_type(i, j, n_type):
                    obstacles_have_been_generated = True
                    break
            else:
                continue

            break

        assert obstacles_have_been_generated
