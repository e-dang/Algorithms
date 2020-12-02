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
    }

    _handleRunAlgorithm() {
        this._algorithmFromString().run(() => this._handleCompleteAlgorithm());
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
        }
    }

    _handleCompleteAlgorithm() {
        this.grid.drawPath();
        document.getElementById('algComplete').hidden = false;
    }

    _handleReset() {
        document.getElementById('algComplete').hidden = true;
        this.grid.clear();
        this.grid.draw();
    }
}

module.exports = GridController;
