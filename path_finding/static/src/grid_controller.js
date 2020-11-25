const Grid = require('./grid');

class GridController {
    constructor(nRows, nCols) {
        this.grid = new Grid(nRows, nCols);

        this.grid.draw();
    }

    addUpdateGridEventListener() {
        document.getElementById('submitButton').addEventListener('click', this._handleUpdateGrid);
    }

    _handleUpdateGrid() {
        const [nRows, nCols] = this._parseInput(document.getElementById('dimensionsInput'));
        const [startRow, startCol] = this._parseInput(document.getElementById('startNodeInput'));
        const [endRow, endCol] = this._parseInput(document.getElementById('endNodeInput'));

        this.grid.reset(nRows, nCols, startRow, startCol, endRow, endCol);
    }

    _parseInput(element) {
        return element.textContent.split(',').map((value) => parseInt(value));
    }
}

module.exports = GridController;
