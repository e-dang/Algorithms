const GridController = require('../src/grid_controller');
const Grid = require('../src/grid');
const Dijkstra = require('../src/algorithms/dijkstra');
const BaseAlgorithm = require('../src/algorithms/base_algorithm');
const DFS = require('../src/algorithms/dfs');
const DFSShortestPath = require('../src/algorithms/dfssp');
const BFS = require('../src/algorithms/bfs');
const AStarSearch = require('../src/algorithms/astar');
const GreedyBestFirstSearch = require('../src/algorithms/greedy-bfs.js');
const BidirectionalSearch = require('../src/algorithms/bidirectional');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../../templates/path_finding.html'), 'utf8');

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
        document.documentElement.innerHTML = html.toString();
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
        controller._handleUpdateGrid = jest.fn();
        controller.addUpdateGridEventListener();

        document.getElementById('submitButton').click();

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

    test('_handleUpdateGridOnKeyPress is called when user starts typing in input', () => {
        controller._handleUpdateGridOnKeyPress = jest.fn();
        controller.addUpdateGridEventListenerOnKeyPress();

        document.getElementById('dimensionsInput').dispatchEvent(new Event('keypress'));

        expect(controller._handleUpdateGridOnKeyPress).toHaveBeenCalledTimes(1);
    });

    test('_handleUpdateGridOnKeyPress calls _handleUpdateGrid when Enter is pressed', () => {
        controller._handleUpdateGrid = jest.fn();
        const event = new Event('keypress');
        event.keyCode = 13;

        controller._handleUpdateGridOnKeyPress(event);

        expect(controller._handleUpdateGrid).toHaveBeenCalledTimes(1);
    });

    test('_handleUpdateGridOnKeyPress sets gridErrorMessage to hidden when a non-Enter key is pressed', () => {
        const element = document.getElementById('gridErrorMessage');
        element.hidden = false;

        controller._handleUpdateGridOnKeyPress(new Event('keypress'));

        expect(element).not.toBeVisible();
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

    test('algorithmFromString returns GreedyBestFirstSearch when "greedy-bfs" is alg property', () => {
        controller.alg = 'greedy-bfs';

        expect(controller._algorithmFromString()).toBeInstanceOf(GreedyBestFirstSearch);
    });

    test('algorithmFromString returns BidirectionalSearch when "bidirectional" is alg property', () => {
        controller.alg = 'bidirectional';

        expect(controller._algorithmFromString()).toBeInstanceOf(BidirectionalSearch);
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
        controller.addRunAlgorithmEventListener();

        document.getElementById('runButton').click();

        expect(controller._handleRunAlgorithm).toHaveBeenCalledTimes(1);
    });

    test('_handleRunAlgorithm sets isAlgRunning to true on grid', () => {
        controller.grid.isAlgRunning = false;

        controller._handleRunAlgorithm();

        expect(controller.grid.isAlgRunning).toBe(true);
    });

    test('_handleUpdateAlgorithm sets the alg property to the current selection', () => {
        const selection = document.getElementById('algorithmSelect');
        const option = selection.children[1];
        option.selected = true;

        controller._handleUpdateAlgorithm();

        expect(controller.alg).toBe(option.value);
    });

    test('_handleUpdateAlgorithm gets called when algorithm selection is chosen', () => {
        const selection = document.getElementById('algorithmSelect');
        controller._handleUpdateAlgorithm = jest.fn();
        controller.addUpdateAlgorithmEventListener();

        selection.dispatchEvent(new Event('change'));

        expect(controller._handleUpdateAlgorithm).toHaveBeenCalledTimes(1);
    });

    test('_handleCompleteAlgorithm sets algComplete element to be visible', () => {
        element = document.getElementById('algComplete');
        element.hidden = true;

        controller._handleCompleteAlgorithm();

        expect(element).toBeVisible();
    });

    test('_handleCompleteAlgorithm sets cost element to visible', () => {
        element = document.getElementById('cost');
        element.hidden = true;

        controller._handleCompleteAlgorithm();

        expect(element).toBeVisible();
    });

    test('_handleCompleteAlgorithm sets cost element html to equal cost parameter', () => {
        element = document.getElementById('cost');
        element.innerHTML = '';
        const cost = 10;

        controller._handleCompleteAlgorithm(cost);

        expect(element).toHaveTextContent(cost);
    });

    test('_handleCompleteAlgorithm calls grid.drawPath', () => {
        controller._handleCompleteAlgorithm();

        expect(controller.grid.drawPath).toHaveBeenCalledTimes(1);
    });

    test('_handleCompleteAlgorithm sets isAlgRunning to false on grid', () => {
        controller.grid.isAlgRunning = true;

        controller._handleCompleteAlgorithm();

        expect(controller.grid.isAlgRunning).toBe(false);
    });

    test('_handleReset sets algComplete element to be invisible', () => {
        element = document.getElementById('algComplete');
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

    test('clicking resetButton calls _handleReset', () => {
        controller._handleReset = jest.fn();
        controller.addResetEventListener();

        document.getElementById('resetButton').click();

        expect(controller._handleReset).toHaveBeenCalledTimes(1);
    });

    test('_handleResetPath gets called when resetPathButton is pressed', () => {
        controller._handleResetPath = jest.fn();
        controller.addResetPathButtonEventListener();

        document.getElementById('resetPathButton').click();

        expect(controller._handleResetPath).toHaveBeenCalledTimes(1);
    });

    test('_handleResetPath calls clearPath on grid', () => {
        controller._handleResetPath();

        expect(controller.grid.clearPath).toHaveBeenCalledTimes(1);
    });

    test('_removeAlgorithmCompleteMessages sets algComplete element to hidden', () => {
        const element = document.getElementById('algComplete');
        element.hidden = false;

        controller._removeAlgorithmCompleteMessages();

        expect(element).not.toBeVisible();
    });

    test('_removeAlgorithmCompleteMessages sets cost element to hidden', () => {
        const element = document.getElementById('cost');
        element.hidden = false;

        controller._removeAlgorithmCompleteMessages();

        expect(element).not.toBeVisible();
    });
});
