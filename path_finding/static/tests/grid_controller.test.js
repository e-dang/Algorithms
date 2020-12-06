const GridController = require('../src/grid_controller');
const Grid = require('../src/grid');
const Dijkstra = require('../src/algorithms/dijkstra');
const BaseAlgorithm = require('../src/algorithms/base_algorithm');
const DFS = require('../src/algorithms/dfs');
const DFSShortestPath = require('../src/algorithms/dfssp');
const BFS = require('../src/algorithms/bfs');
const AStarSearch = require('../src/algorithms/astar');

jest.mock('../src/grid');

describe('GridControllerTest', () => {
    const nRows = 10;
    const nCols = 14;
    const startRow = 1;
    const startCol = 1;
    const endRow = 1;
    const endCol = 1;
    const alg = "Dijkstra's Algorithm";
    let controller;

    beforeEach(() => {
        controller = new GridController(nRows, nCols, startRow, startCol, endRow, endCol, alg);
    });

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    });

    test('constructor initializes a new Grid with the passed in dimensions', () => {
        expect(Grid).toHaveBeenCalledWith(nRows, nCols, startRow, startCol, endRow, endCol);
    });

    test('constructor sets alg parameter to alg property', () => {
        expect(controller.alg).toBe(alg);
    });

    test('_parseInput splits string at comma and returns two ints', () => {
        const input = document.createElement('input');
        input.value = '10,11';

        const [first, second] = controller._parseInput(input);

        expect(first).toBe(10);
        expect(second).toBe(11);
    });

    test('_handleUpdateGrid is called when submit button is pressed', () => {
        button = document.createElement('button');
        button.id = 'submitButton';
        document.body.appendChild(button);
        controller._handleUpdateGrid = jest.fn();
        controller.addUpdateGridEventListener();

        button.click();

        expect(controller._handleUpdateGrid).toHaveBeenCalledTimes(1);
    });

    describe('test _handleUpdateGrid with different inputs', () => {
        beforeEach(() => {
            const element = document.createElement('input');
            element.id = 'dimensionsInput';
            document.body.append(element);
            controller._handleGridInputError = jest.fn();
        });

        test('_handleUpdateGrid doesnt call grid.reset if nRows * nCols < 1', () => {
            controller._parseInput = jest.fn().mockReturnValueOnce([1, 1]);

            controller._handleUpdateGrid();

            expect(controller.grid.reset).not.toHaveBeenCalled();
            expect(controller._handleGridInputError).toHaveBeenCalledTimes(1);
        });

        test('_handleUpdateGrid doesnt call grid.reset if nRows and nCols is negative', () => {
            controller._parseInput = jest.fn().mockReturnValueOnce([-2, -2]);

            controller._handleUpdateGrid();

            expect(controller.grid.reset).not.toHaveBeenCalled();
            expect(controller._handleGridInputError).toHaveBeenCalledTimes(1);
        });

        test('_handleUpdateGrid calls grid.reset with valid input', () => {
            controller._parseInput = jest.fn().mockReturnValueOnce([1, 2]);

            controller._handleUpdateGrid();

            expect(controller.grid.reset).toHaveBeenCalledTimes(1);
            expect(controller._handleGridInputError).not.toHaveBeenCalled();
        });
    });

    test('_handleUpdateGridOnChange is called when user starts typing in input', () => {
        const element = document.createElement('input');
        element.id = 'dimensionsInput';
        document.body.append(element);
        controller._handleUpdateGridOnChange = jest.fn();
        controller.addUpdateGridEventListenerOnChange();

        element.dispatchEvent(new Event('change'));

        expect(controller._handleUpdateGridOnChange).toHaveBeenCalledTimes(1);
    });

    test('_algorithmFromString returns Dijkstra when "dijkstra" is the alg property', () => {
        controller.alg = 'dijkstra';

        expect(controller._algorithmFromString()).toBeInstanceOf(Dijkstra);
    });

    test('_algorithmFromString returns BaseAlgorithm when "null" is the alg property', () => {
        controller.alg = 'null';

        expect(controller._algorithmFromString()).toBeInstanceOf(BaseAlgorithm);
    });

    test('_algorithmFromString returns DFS when "dfs" is alg property', () => {
        controller.alg = 'dfs';

        expect(controller._algorithmFromString()).toBeInstanceOf(DFS);
    });

    test('_algorithmFromString returns DFSShortestPath when "dfssp" is alg property', () => {
        controller.alg = 'dfssp';

        expect(controller._algorithmFromString()).toBeInstanceOf(DFSShortestPath);
    });

    test('_algorithmFromString returns BFS when "bfs" is alg property', () => {
        controller.alg = 'bfs';

        expect(controller._algorithmFromString()).toBeInstanceOf(BFS);
    });

    test('_algorithmFromString returns AStarSearch when "a*" is alg property', () => {
        controller.alg = 'a*';

        expect(controller._algorithmFromString()).toBeInstanceOf(AStarSearch);
    });

    test('_handleRunAlgorithm calls _algorithmFromString and run on its return value', () => {
        const mockReturn = {run: jest.fn()};
        controller._algorithmFromString = jest.fn().mockReturnValueOnce(mockReturn);

        controller._handleRunAlgorithm();

        expect(controller._algorithmFromString).toHaveBeenCalledTimes(1);
        expect(mockReturn.run).toHaveBeenCalledTimes(1);
    });

    test('_handleRunAlgorithm gets called when runButton is clicked', () => {
        controller._handleRunAlgorithm = jest.fn();
        const button = document.createElement('button');
        button.id = 'runButton';
        document.body.append(button);
        controller.addRunAlgorithmEventListener();

        button.click();

        expect(controller._handleRunAlgorithm).toHaveBeenCalledTimes(1);
    });

    test('_handleUpdateAlgorithm sets the alg property to the current selection', () => {
        const selection = document.createElement('select');
        const option = document.createElement('option');
        const value = 'Blah blah blah';
        const p = document.createElement('p');
        p.id = 'algorithmSelectErrorMessage';
        selection.id = 'algorithmSelect';
        option.value = value;
        selection.appendChild(option);
        selection.options[0].selected = true;
        document.body.appendChild(selection);
        document.body.appendChild(p);

        controller._handleUpdateAlgorithm();

        expect(controller.alg).toBe(value);
    });

    test('_handleUpdateAlgorithm gets called when algorithm selection is chosen', () => {
        const selection = document.createElement('select');
        selection.id = 'algorithmSelect';
        document.body.appendChild(selection);
        controller._handleUpdateAlgorithm = jest.fn();
        controller.addUpdateAlgorithmEventListener();

        selection.dispatchEvent(new Event('change'));

        expect(controller._handleUpdateAlgorithm).toHaveBeenCalledTimes(1);
    });

    describe('test _handleCompleteAlgorithm and _handleReset', () => {
        let element;
        beforeEach(() => {
            element = document.createElement('p');
            element.id = 'algComplete';
            document.body.appendChild(element);
        });

        test('_handleCompleteAlgorithm sets algComplete element to be visible', () => {
            element.hidden = true;

            controller._handleCompleteAlgorithm();

            expect(element).toBeVisible();
        });

        test('_handleCompleteAlgorithm calls grid.drawPath', () => {
            controller._handleCompleteAlgorithm();

            expect(controller.grid.drawPath).toHaveBeenCalledTimes(1);
        });

        test('_handleReset sets algComplete element to be invisible', () => {
            element.hidden = false;

            controller._handleReset();

            expect(element).not.toBeVisible();
        });

        test('_handleReset calls grid.draw()', () => {
            controller.grid.draw = jest.fn();

            controller._handleReset();

            expect(controller.grid.draw).toHaveBeenCalledTimes(1);
        });

        test('_handleReset calls grid.clear()', () => {
            controller.grid.clear = jest.fn();

            controller._handleReset();

            expect(controller.grid.clear).toHaveBeenCalledTimes(1);
        });
    });

    test('clicking resetButton calls _handleReset', () => {
        const resetButton = document.createElement('button');
        resetButton.id = 'resetButton';
        document.body.appendChild(resetButton);
        controller._handleReset = jest.fn();
        controller.addResetEventListener();

        resetButton.click();

        expect(controller._handleReset).toHaveBeenCalledTimes(1);
    });
});
