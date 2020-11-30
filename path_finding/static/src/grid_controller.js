const Grid = require('./grid');
const Dijkstra = require('./algorithms/dijkstra');

class GridController {
    constructor(nRows, nCols, startRow, startCol, endRow, endCol, alg) {
        this.grid = new Grid(nRows, nCols, startRow, startCol, endRow, endCol);
        this.alg = alg;
        this.grid.draw();
    }

    addUpdateGridEventListener() {
        document.getElementById('submitButton').addEventListener('click', () => this._handleUpdateGrid());
    }

    addRunAlgorithmEventListener() {
        document.getElementById('runButton').addEventListener('click', () => this._handleRunAlgorithm());
    }

    addUpdateAlgorithmEventListener() {
        document.getElementById('algorithmSelect').addEventListener('change', () => this._handleUpdateAlgorithm());
    }

    _handleUpdateGrid() {
        const [nRows, nCols] = this._parseInput(document.getElementById('dimensionsInput'));
        const [startRow, startCol] = this._parseInput(document.getElementById('startNodeInput'));
        const [endRow, endCol] = this._parseInput(document.getElementById('endNodeInput'));

        this.grid.reset(nRows, nCols, startRow, startCol, endRow, endCol);
        this._handleUpdateTable(nRows, nCols, startRow, startCol, endRow, endCol);
    }

    _handleUpdateTable(nRows, nCols, startRow, startCol, endRow, endCol) {
        document.getElementById('rows').textContent = nRows;
        document.getElementById('cols').textContent = nCols;
        document.getElementById('startRow').textContent = startRow;
        document.getElementById('startCol').textContent = startCol;
        document.getElementById('endRow').textContent = endRow;
        document.getElementById('endCol').textContent = endCol;
    }

    _handleUpdateAlgorithm() {
        this.alg = document.getElementById('algorithmSelect').value;
    }

    _handleRunAlgorithm() {
        this._algorithmFromString().run(() => this._handleCompleteAlgorithm());
    }

    _parseInput(element) {
        return element.value.split(',').map((value) => parseInt(value));
    }

    _algorithmFromString() {
        if (this.alg == "Dijkstra's Algorithm") {
            return new Dijkstra(this.grid);
        }
    }

    _handleCompleteAlgorithm() {
        this.grid.drawPath();
        document.getElementById('algComplete').hidden = false;
    }
}

module.exports = GridController;
