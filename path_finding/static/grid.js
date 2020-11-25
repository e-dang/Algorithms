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

    _createNode(row, col) {
        const node = document.createElement('div');
        node.className = 'node';
        node.id = `n${row * this.nCols + col}`;
        return node;
    }
}

module.exports = Grid;
