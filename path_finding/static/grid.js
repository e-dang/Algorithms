class Grid {
    constructor(nRows, nCols) {
        this.nRows = nRows;
        this.nCols = nCols;
    }

    draw() {
        const grid = document.createElement('div');
        grid.id = 'grid';
        grid.className = 'grid';

        for (let row = 0; row < this.nRows; row++) {
            for (let col = 0; col < this.nCols; col++) {
                grid.appendChild(this._createNode(row, col));
            }
        }

        document.body.appendChild(grid);
    }

    reset(nRows, nCols, startRow, startCol, endRow, endCol) {
        this.setDimensions(nRows, nCols);
        this.setStartNode(startRow, startCol);
        this.setEndNode(endRow, endCol);
        this.clear();
        this.draw();
    }

    clear() {
        document.getElementById('grid').remove();
    }

    setDimensions(rows, cols) {
        this.nRows = rows;
        this.nCols = cols;
    }

    setStartNode(row, col) {
        this.startRow = row;
        this.startCol = col;
    }

    setEndNode(row, col) {
        this.endRow = row;
        this.endCol = col;
    }

    _createNode(row, col) {
        const node = document.createElement('div');
        node.className = 'node';
        node.id = `n${row * this.nCols + col}`;
        return node;
    }
}

module.exports = Grid;
