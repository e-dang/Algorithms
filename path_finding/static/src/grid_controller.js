const Grid = require('./grid');
const Dijkstra = require('./algorithms/dijkstra');
const BaseAlgorithm = require('./algorithms/base_algorithm');
const DFS = require('./algorithms/dfs');
const DFSShortestPath = require('./algorithms/dfssp');
const BFS = require('./algorithms/bfs');
const AStarSearch = require('./algorithms/astar');
const GreedyBestFirstSearch = require('./algorithms/greedy-bfs');
const BidirectionalSearch = require('./algorithms/bidirectional');

class GridController {
    constructor(nRows, nCols, startRow, startCol, endRow, endCol, alg) {
        this.grid = new Grid(nRows, nCols, startRow, startCol, endRow, endCol);
        this.alg = alg;
        this.grid.draw();
    }

    addEventListeners() {
        this.addUpdateGridEventListener()
            .addUpdateGridEventListenerOnChange()
            .addUpdateAlgorithmEventListener()
            .addRunAlgorithmEventListener()
            .addResetEventListener()
            .addResetPathButtonEventListener();
    }

    addUpdateGridEventListener() {
        document.getElementById('submitButton').addEventListener('click', () => this._handleUpdateGrid());

        return this;
    }

    addUpdateGridEventListenerOnChange() {
        document.getElementById('dimensionsInput').addEventListener('change', () => this._handleUpdateGridOnChange());

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

    _handleUpdateGrid() {
        const [nRows, nCols] = this._parseInput(document.getElementById('dimensionsInput'));
        if (nRows > 0 && nCols > 0 && nRows * nCols > 1) {
            this.grid.reset(nRows, nCols);
        } else {
            this._handleGridInputError();
        }
    }

    _handleUpdateAlgorithm() {
        this.alg = document.getElementById('algorithmSelect').value;
        document.getElementById('algorithmSelectErrorMessage').hidden = true;
        document.getElementById('algorithmSelect').className = '';
    }

    _handleRunAlgorithm() {
        const callback = (cost) => {
            this._handleCompleteAlgorithm();
            const element = document.getElementById('cost');
            element.hidden = false;
            element.innerHTML = cost;
        };

        this._algorithmFromString().run((cost) => callback(cost));
    }

    _handleGridInputError() {
        document.getElementById('gridErrorMessage').hidden = false;
    }

    _handleUpdateGridOnChange() {
        document.getElementById('gridErrorMessage').hidden = true;
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
            return new AStarSearch(this.grid);
        } else if (this.alg == 'greedy-bfs') {
            return new GreedyBestFirstSearch(this.grid);
        } else if (this.alg == 'bidirectional') {
            return new BidirectionalSearch(this.grid);
        } else {
            return new BaseAlgorithm(this.grid);
        }
    }

    _handleCompleteAlgorithm() {
        this.grid.drawPath();
        document.getElementById('algComplete').hidden = false;
    }

    _handleReset() {
        document.getElementById('algComplete').hidden = true;
        document.getElementById('cost').hidden = true;
        this.grid.clear();
        this.grid.draw();
    }

    _handleResetPath() {
        document.getElementById('algComplete').hidden = true;
        document.getElementById('cost').hidden = true;
        this.grid.clearPath();
    }
}

module.exports = GridController;
