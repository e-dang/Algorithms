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
const heuristics = require('../src/utils/heuristics');
const RandomizedDFS = require('../src/maze_generators/rand_dfs');
const RandomizedPrims = require('../src/maze_generators/prim');
const RandomMaze = require('../src/maze_generators/random');
const Slider = require('bootstrap-slider');

jest.mock('../src/grid');

describe('GridControllerTest', () => {
    let nRows;
    let nCols;
    let startRow;
    let startCol;
    let endRow;
    let endCol;
    let alg;
    let slider;
    let toggle;
    let controller;

    beforeEach(() => {
        nRows = 10;
        nCols = 14;
        startRow = 1;
        startCol = 1;
        endRow = 1;
        endCol = 1;
        alg = "Dijkstra's Algorithm";
        document.documentElement.innerHTML = html.toString();
        slider = new Slider('#weightSlider');
        toggle = $('#weightToggle').bootstrapToggle();
        controller = new GridController(nRows, nCols, startRow, startCol, endRow, endCol, alg, slider, toggle);
    });

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    });

    test('constructor initializes a new Grid with the passed in dimensions', () => {
        expect(Grid).toHaveBeenCalledWith(nRows, nCols, startRow, startCol, endRow, endCol, slider.getValue());
    });

    test('constructor sets alg parameter to alg property', () => {
        expect(controller.alg).toBe(alg);
    });

    test('constructor sets slider property to slider parameter', () => {
        expect(controller.slider).toBe(slider);
    });

    test('constructor sets toggle property to toggle parameter', () => {
        expect(controller.toggle).toBe(toggle);
    });

    test('_parseInput splits string at comma and returns two ints', () => {
        const input = document.createElement('input');
        input.value = '10,11';

        const [first, second] = controller._parseInput(input);

        expect(first).toBe(10);
        expect(second).toBe(11);
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

    test('_handleRunAlgorithm sets isAlgRunning to true', () => {
        const mockReturn = {run: jest.fn()};
        controller._algorithmFromString = jest.fn().mockReturnValueOnce(mockReturn);
        controller.isAlgRunning = false;

        controller._handleRunAlgorithm();

        expect(controller.isAlgRunning).toBe(true);
    });

    test('_handleRunAlgorithm sets isAlgRunning to true on grid', () => {
        const mockReturn = {run: jest.fn()};
        controller._algorithmFromString = jest.fn().mockReturnValueOnce(mockReturn);
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

    test('_handleUpdateAlgorithm calls _toggleHeuristicSelect', () => {
        controller._toggleHeuristicSelect = jest.fn();

        controller._handleUpdateAlgorithm();

        expect(controller._toggleHeuristicSelect).toHaveBeenCalledTimes(1);
    });

    test('_handleCompleteAlgorithm sets algComplete element to be visible when cost is not null', () => {
        element = document.getElementById('algComplete');
        element.hidden = true;

        controller._handleCompleteAlgorithm(1);

        expect(element).toBeVisible();
    });

    test('_handleCompleteAlgorithm doesnt set algComplete element to be visible when cost is null', () => {
        element = document.getElementById('algComplete');
        element.hidden = true;

        controller._handleCompleteAlgorithm(null);

        expect(element).not.toBeVisible();
    });

    test('_handleCompleteAlgorithm sets cost element to visible when cost is not null', () => {
        element = document.getElementById('cost');
        element.hidden = true;

        controller._handleCompleteAlgorithm(1);

        expect(element).toBeVisible();
    });

    test('_handleCompleteAlgorithm doesnt set cost element to visible when cost is null', () => {
        element = document.getElementById('cost');
        element.hidden = true;

        controller._handleCompleteAlgorithm(null);

        expect(element).not.toBeVisible();
    });

    test('_handleCompleteAlgorithm sets cost element html to equal cost parameter', () => {
        element = document.getElementById('cost');
        element.innerHTML = '';
        const cost = 10;

        controller._handleCompleteAlgorithm(cost);

        expect(element).toHaveTextContent(cost);
    });

    test('_handleCompleteAlgorithm calls grid.drawPath when cost is not null', () => {
        controller._handleCompleteAlgorithm(1);

        expect(controller.grid.drawPath).toHaveBeenCalledTimes(1);
    });

    test('_handleCompleteAlgorithm doesnt call grid.drawPath when cost is null', () => {
        controller._handleCompleteAlgorithm(null);

        expect(controller.grid.drawPath).not.toHaveBeenCalled();
    });

    test('_handleCompleteAlgorithm sets isAlgRunning to false', () => {
        controller.isAlgRunning = true;

        controller._handleCompleteAlgorithm();

        expect(controller.isAlgRunning).toBe(false);
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

    test('_callbackWrapper doesnt call function if isAlgRunning is true', () => {
        const func = jest.fn();
        controller.isAlgRunning = true;

        controller._callbackWrapper(func);

        expect(func).not.toHaveBeenCalled();
    });

    test('_callbackWrapper calls function if isAlgRunning is false', () => {
        const func = jest.fn();
        controller.isAlgRunning = false;

        controller._callbackWrapper(func);

        expect(func).toHaveBeenCalledTimes(1);
    });

    test('_toggleHeuristicSelect hides heuristicSelect when alg prop is dijkstra', () => {
        controller.alg = 'dijkstra';
        const element = document.getElementById('heuristicSelect');
        element.disable = true;

        controller._toggleHeuristicSelect();

        expect(element).toBeDisabled();
    });

    test('_toggleHeuristicSelect hides heuristicSelect when alg prop is dfs', () => {
        controller.alg = 'dfs';
        const element = document.getElementById('heuristicSelect');
        element.disable = true;

        controller._toggleHeuristicSelect();

        expect(element).toBeDisabled();
    });

    test('_toggleHeuristicSelect hides heuristicSelect when alg prop is dfssp', () => {
        controller.alg = 'dfssp';
        const element = document.getElementById('heuristicSelect');
        element.disable = true;

        controller._toggleHeuristicSelect();

        expect(element).toBeDisabled();
    });

    test('_toggleHeuristicSelect disables heuristicSelect when alg prop is bfs', () => {
        controller.alg = 'bfs';
        const element = document.getElementById('heuristicSelect');
        element.disabled = true;

        controller._toggleHeuristicSelect();

        expect(element).toBeDisabled();
    });

    test('_toggleHeuristicSelect disables heuristicSelect when alg prop is bidirectional', () => {
        controller.alg = 'bidirectional';
        const element = document.getElementById('heuristicSelect');
        element.disabled = true;

        controller._toggleHeuristicSelect();

        expect(element).toBeDisabled();
    });

    test('_toggleHeuristicSelect enables heuristicSelect when alg prop is a*', () => {
        controller.alg = 'a*';
        const element = document.getElementById('heuristicSelect');
        element.disabled = true;

        controller._toggleHeuristicSelect();

        expect(element).toBeEnabled();
    });

    test('_toggleHeuristicSelect enables heuristicSelect when alg prop is greedy-bfs', () => {
        controller.alg = 'greedy-bfs';
        const element = document.getElementById('heuristicSelect');
        element.disabled = true;

        controller._toggleHeuristicSelect();

        expect(element).toBeEnabled();
    });

    test('_handleUpdateHeuristic sets heuristic prop to l1Norm function if select heuristic is l1Norm', () => {
        document.getElementById('heuristicSelect').value = 'l1Norm';

        controller._handleUpdateHeuristic();

        expect(controller.heuristic).toBe(heuristics.l1Norm);
    });

    test('_handleUpdateHeuristic sets heuristic prop to l2Norm function if select heuristic is l2Norm', () => {
        document.getElementById('heuristicSelect').value = 'l2Norm';

        controller._handleUpdateHeuristic();

        expect(controller.heuristic).toBe(heuristics.l2Norm);
    });

    test('_handleUpdateHeuristic is called when a new heuristic is selected', () => {
        const element = document.getElementById('heuristicSelect');
        controller._handleUpdateHeuristic = jest.fn();
        controller.addHeuristicSelectEventListener();

        element.dispatchEvent(new Event('change'));

        expect(controller._handleUpdateHeuristic).toHaveBeenCalledTimes(1);
    });

    test('_handleMazeGeneration gets called when a maze generation algorithm is selected', () => {
        const element = document.getElementById('mazeGenerationSelect');
        controller._handleMazeGeneration = jest.fn();
        controller.addMazeGenerationEventHandler();

        element.dispatchEvent(new Event('change'));

        expect(controller._handleMazeGeneration).toHaveBeenCalledTimes(1);
    });

    test('_handleMazeGeneration calls _mazeGeneratorFromString with value of mazeGenerationSelect', () => {
        const element = document.getElementById('mazeGenerationSelect');
        controller._mazeGeneratorFromString = jest.fn().mockReturnValueOnce({generate: jest.fn()});

        controller._handleMazeGeneration();

        expect(controller._mazeGeneratorFromString).toHaveBeenCalledWith(element.value);
    });

    test('_handleMazeGeneration calls generate() on return value of _mazeGeneratorFromString', () => {
        const mockRetVal = {generate: jest.fn()};
        controller._mazeGeneratorFromString = jest.fn().mockReturnValueOnce(mockRetVal);

        controller._handleMazeGeneration();

        expect(mockRetVal.generate).toHaveBeenCalledTimes(1);
    });

    test('_mazeGeneratorFromString returns RandomizedDFS when parameter is "rand-dfs"', () => {
        const generator = 'rand-dfs';

        const retVal = controller._mazeGeneratorFromString(generator);

        expect(retVal).toBeInstanceOf(RandomizedDFS);
    });

    test('_mazeGeneratorFromString returns RandomizedPrims when parameter is "prims"', () => {
        const generator = 'prims';

        const retVal = controller._mazeGeneratorFromString(generator);

        expect(retVal).toBeInstanceOf(RandomizedPrims);
    });

    test('_mazeGeneratorFromString returns Random when parameter is "random"', () => {
        const generator = 'random';

        const retVal = controller._mazeGeneratorFromString(generator);

        expect(retVal).toBeInstanceOf(RandomMaze);
    });

    test('_handleUpdateWeight is called when slider value changes', () => {
        controller._handleUpdateWeight = jest.fn();
        controller.addUpdateWeightEventListener();

        controller.slider.setValue(100, false, true);

        expect(controller._handleUpdateWeight).toHaveBeenCalledTimes(1);
    });

    test('_handleUpdateWeight sets weight prop on grid to weight parameter', () => {
        const weight = 12;
        controller.grid.weight = 50;

        controller._handleUpdateWeight(weight);

        expect(controller.grid.weight).toBe(weight);
    });

    test('_handleWeightToggle is called when toggle is clicked', () => {
        controller._handleWeightToggle = jest.fn();
        controller.addWeightToggleEventListener();

        controller.toggle.bootstrapToggle('on');

        expect(controller._handleWeightToggle).toHaveBeenCalledTimes(1);
    });

    test('_handleWeightToggle sets isWeightToggleOn on grid to true when toggle is checked', () => {
        controller.toggle.bootstrapToggle('on');
        controller.grid.isWeightToggleOn = false;

        controller._handleWeightToggle();

        expect(controller.grid.isWeightToggleOn).toBe(true);
    });

    test('_handleWeightToggle sets isWeightToggleOn on grid to false when toggle is not checked', () => {
        controller.toggle.bootstrapToggle('off');
        controller.grid.isWeightToggleOn = true;

        controller._handleWeightToggle();

        expect(controller.grid.isWeightToggleOn).toBe(false);
    });
});
