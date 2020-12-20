const Grid = require('./grid');
const Dijkstra = require('./algorithms/dijkstra');
const BaseAlgorithm = require('./algorithms/base_algorithm');
const DFS = require('./algorithms/dfs');
const DFSShortestPath = require('./algorithms/dfssp');
const BFS = require('./algorithms/bfs');
const AStarSearch = require('./algorithms/astar');
const GreedyBestFirstSearch = require('./algorithms/greedy-bfs');
const BidirectionalSearch = require('./algorithms/bidirectional');
const heuristics = require('./utils/heuristics');
const RandomizedDFS = require('./maze_generators/rand_dfs');
const RandomizedPrims = require('./maze_generators/prim');
const RandomWallMaze = require('./maze_generators/rand_wall_maze');
const RandomWeightMaze = require('./maze_generators/rand_weight_maze');
const utils = require('./utils/utils');
const RecursiveDivision = require('./maze_generators/recursive_division');

class GridController {
    constructor(nRows, nCols, alg, slider) {
        this.grid = new Grid(nRows, nCols, slider.getValue());
        this.alg = alg;
        this.isAlgRunning = false;
        this.slider = slider;
        this.moves = utils.manhattan_moves;
        this._handleUpdateHeuristic();
        this.grid.draw();
    }

    addEventListeners() {
        this.addUpdateGridEventListenerOnKeyPress()
            .addUpdateAlgorithmEventListener()
            .addRunAlgorithmEventListener()
            .addResetEventListener()
            .addResetPathButtonEventListener()
            .addHeuristicSelectEventListener()
            .addMazeGenerationEventListener()
            .addUpdateWeightEventListener()
            .addWeightToggleEventListener()
            .addDiagonalMovesToggleEventListener();
    }

    addUpdateGridEventListenerOnKeyPress() {
        document
            .getElementById('dimensionsInput')
            .addEventListener('keypress', (event) => this._handleUpdateGridOnKeyPress(event));

        return this;
    }

    addRunAlgorithmEventListener() {
        document.getElementById('runButton').addEventListener('click', () => this._handleRunAlgorithm());

        return this;
    }

    addUpdateAlgorithmEventListener() {
        document.getElementById('algorithmSelect').addEventListener('change', () => this._handleUpdateAlgorithm());

        return this;
    }

    addResetEventListener() {
        document.getElementById('resetButton').addEventListener('click', () => this._handleReset());

        return this;
    }

    addResetPathButtonEventListener() {
        document.getElementById('resetPathButton').addEventListener('click', () => this._handleResetPath());

        return this;
    }

    addHeuristicSelectEventListener() {
        document.getElementById('heuristicSelect').addEventListener('change', () => this._handleUpdateHeuristic());

        return this;
    }

    addMazeGenerationEventListener() {
        document.getElementById('mazeGenerationSelect').addEventListener('change', () => this._handleMazeGeneration());

        return this;
    }

    addUpdateWeightEventListener() {
        this.slider.on('change', (value) => this._handleUpdateWeight(value.newValue));

        return this;
    }

    addWeightToggleEventListener() {
        document.getElementById('weightToggle').addEventListener('change', (event) => this._handleWeightToggle(event));

        return this;
    }

    addDiagonalMovesToggleEventListener() {
        document
            .getElementById('diagMovesToggle')
            .addEventListener('change', (event) => this._handleDiagonalMovesToggle(event));

        return this;
    }

    _handleUpdateGrid() {
        this._callbackWrapper(() => {
            const element = document.getElementById('dimensionsInput');
            const [nRows, nCols] = this._parseInput(element);
            const {maxRows, maxCols} = utils.calcMaximumGridDims();
            if (nRows > 0 && nCols > 0 && nRows * nCols > 1 && nRows <= maxRows && nCols <= maxCols) {
                this.grid.reset(nRows, nCols);
                element.value = '';
                this._removeAlgorithmCompleteMessages();
            } else {
                this._handleGridInputError();
            }
        });
    }

    _handleUpdateAlgorithm() {
        this.alg = document.getElementById('algorithmSelect').value;
        this._displayAlgInfo();
        document.getElementById('algorithmSelectErrorMessage').hidden = true;
        $('#algorithmSelect').selectpicker('setStyle', 'btn-outline-danger', 'remove');
        this._toggleHeuristicSelect();
    }

    _handleRunAlgorithm() {
        this._callbackWrapper(() => {
            this._setIsAlgRunning(true);
            this._algorithmFromString().run((cost) => this._handleCompleteAlgorithm(cost));
        });
    }

    _handleGridInputError() {
        document.getElementById('gridErrorMessage').hidden = false;
        document.getElementById('dimensionsInput').classList.add('is-invalid');
    }

    _handleUpdateGridOnKeyPress(event) {
        this._callbackWrapper(() => {
            if (event.keyCode === 13) {
                this._handleUpdateGrid();
            } else {
                document.getElementById('gridErrorMessage').hidden = true;
                document.getElementById('dimensionsInput').classList.remove('is-invalid');
            }
        });
    }

    _handleUpdateHeuristic() {
        this.heuristic = heuristics[document.getElementById('heuristicSelect').value];
    }

    _parseInput(element) {
        return element.value.split(',').map((value) => parseInt(value));
    }

    _algorithmFromString() {
        if (this.alg == 'dijkstra') {
            return new Dijkstra(this.grid, this.moves);
        } else if (this.alg == 'dfs') {
            return new DFS(this.grid, this.moves);
        } else if (this.alg == 'dfssp') {
            return new DFSShortestPath(this.grid, this.moves);
        } else if (this.alg == 'bfs') {
            return new BFS(this.grid, this.moves);
        } else if (this.alg == 'a*') {
            return new AStarSearch(this.grid, this.moves, this.heuristic);
        } else if (this.alg == 'greedy-bfs') {
            return new GreedyBestFirstSearch(this.grid, this.moves, this.heuristic);
        } else if (this.alg == 'bidirectional') {
            return new BidirectionalSearch(this.grid, this.moves);
        } else {
            return new BaseAlgorithm(this.grid, this.moves);
        }
    }

    _handleCompleteAlgorithm(cost) {
        this._setIsAlgRunning(false);
        if (cost !== null) {
            this.grid.drawPath();
            document.getElementById('algComplete').hidden = false;
            const costElement = document.getElementById('cost');
            costElement.textContent = cost;
        }
    }

    _handleReset() {
        this._callbackWrapper(() => {
            this._removeAlgorithmCompleteMessages();
            this.grid.clear();
            this.grid.draw();
        });
    }

    _handleResetPath() {
        this._callbackWrapper(() => {
            this._removeAlgorithmCompleteMessages();
            this.grid.clearPath();
        });
    }

    async _handleMazeGeneration() {
        this._handleReset();
        this._setIsAlgRunning(true);
        const element = document.getElementById('mazeGenerationSelect');
        await this._mazeGeneratorFromString(document.getElementById('mazeGenerationSelect').value).generate();
        element.options[0].selected = true;
        this._setIsAlgRunning(false);
    }

    _handleUpdateWeight(weight) {
        this.grid.weight = weight;
    }

    _handleWeightToggle(event) {
        this.grid.isWeightToggleOn = event.target.checked;
    }

    _handleDiagonalMovesToggle(event) {
        if (event.target.checked) {
            this.moves = utils.diagonal_moves;
            const element = $('#l1Norm');
            element.prop('disabled', true);
            element.prop('selected', false);
            $('#l2Norm').prop('selected', true);
        } else {
            this.moves = utils.manhattan_moves;
            $('#l1Norm').prop('disabled', false);
        }

        $('#heuristicSelect').selectpicker('refresh');
        this._handleUpdateHeuristic();
    }

    _removeAlgorithmCompleteMessages() {
        document.getElementById('algComplete').hidden = true;
    }

    _callbackWrapper(callback) {
        if (!this.isAlgRunning) {
            callback();
        }
    }

    _toggleHeuristicSelect() {
        if (
            this.alg == 'dijkstra' ||
            this.alg == 'dfs' ||
            this.alg == 'dfssp' ||
            this.alg == 'bfs' ||
            this.alg == 'bidirectional'
        ) {
            $('#heuristicSelect').prop('disabled', true);
        } else if (this.alg == 'a*' || this.alg == 'greedy-bfs') {
            $('#heuristicSelect').prop('disabled', false);
        }

        $('#heuristicSelect').selectpicker('refresh');
    }

    _mazeGeneratorFromString(generatorStr) {
        if (generatorStr === 'rand-dfs') {
            return new RandomizedDFS(this.grid);
        } else if (generatorStr === 'prims') {
            return new RandomizedPrims(this.grid);
        } else if (generatorStr === 'random-walls') {
            return new RandomWallMaze(this.grid);
        } else if (generatorStr === 'random-weights') {
            return new RandomWeightMaze(this.grid);
        } else if (generatorStr === 'recursive-walls') {
            return new RecursiveDivision(this.grid, true);
        } else if (generatorStr === 'recursive-weights') {
            return new RecursiveDivision(this.grid, false);
        }
    }

    _setIsAlgRunning(state) {
        this.isAlgRunning = state;
        this.grid.isAlgRunning = state;
    }

    _displayAlgInfo() {
        document.getElementById('dijkstraInfo').hidden = this.alg !== 'dijkstra';
        document.getElementById('bfsInfo').hidden = this.alg !== 'bfs';
        document.getElementById('dfsInfo').hidden = this.alg !== 'dfs';
        document.getElementById('dfsspInfo').hidden = this.alg !== 'dfssp';
        document.getElementById('a*Info').hidden = this.alg !== 'a*';
        document.getElementById('greedy-bfsInfo').hidden = this.alg !== 'greedy-bfs';
        document.getElementById('bidirectionalInfo').hidden = this.alg !== 'bidirectional';
    }
}

module.exports = GridController;
