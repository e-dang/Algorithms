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

class GridController {
    constructor(nRows, nCols, startRow, startCol, endRow, endCol, alg, slider, toggle) {
        this.grid = new Grid(nRows, nCols, startRow, startCol, endRow, endCol, slider.getValue());
        this.alg = alg;
        this.isAlgRunning = false;
        this.slider = slider;
        this.toggle = toggle;
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
            .addWeightToggleEventListener();
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
        this.toggle.on('change', () => this._handleWeightToggle());

        return this;
    }

    _handleUpdateGrid() {
        this._callbackWrapper(() => {
            const element = document.getElementById('dimensionsInput');
            const [nRows, nCols] = this._parseInput(element);
            if (nRows > 0 && nCols > 0 && nRows * nCols > 1) {
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
        document.getElementById('algorithmSelectErrorMessage').hidden = true;
        $('#algorithmSelect').selectpicker('setStyle', 'btn-outline-danger', 'remove');
        this._toggleHeuristicSelect();
    }

    _handleRunAlgorithm() {
        this._callbackWrapper(() => {
            this.isAlgRunning = true;
            this.grid.isAlgRunning = true;
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
            return new Dijkstra(this.grid);
        } else if (this.alg == 'dfs') {
            return new DFS(this.grid);
        } else if (this.alg == 'dfssp') {
            return new DFSShortestPath(this.grid);
        } else if (this.alg == 'bfs') {
            return new BFS(this.grid);
        } else if (this.alg == 'a*') {
            return new AStarSearch(this.grid, this.heuristic);
        } else if (this.alg == 'greedy-bfs') {
            return new GreedyBestFirstSearch(this.grid, this.heuristic);
        } else if (this.alg == 'bidirectional') {
            return new BidirectionalSearch(this.grid);
        } else {
            return new BaseAlgorithm(this.grid);
        }
    }

    _handleCompleteAlgorithm(cost) {
        this.isAlgRunning = false;
        this.grid.isAlgRunning = false;
        if (cost !== null) {
            this.grid.drawPath();
            document.getElementById('algComplete').hidden = false;
            const costElement = document.getElementById('cost');
            costElement.hidden = false;
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

    _handleMazeGeneration() {
        this._handleResetPath();
        const element = document.getElementById('mazeGenerationSelect');
        this._mazeGeneratorFromString(document.getElementById('mazeGenerationSelect').value).generate();
        element.options[0].selected = true;
    }

    _handleUpdateWeight(weight) {
        this.grid.weight = weight;
    }

    _handleWeightToggle() {
        this.grid.isWeightToggleOn = this.toggle.prop('checked');
    }

    _removeAlgorithmCompleteMessages() {
        document.getElementById('algComplete').hidden = true;
        document.getElementById('cost').hidden = true;
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
        } else if (generatorStr == 'random-weights') {
            return new RandomWeightMaze(this.grid);
        }
    }
}

module.exports = GridController;
