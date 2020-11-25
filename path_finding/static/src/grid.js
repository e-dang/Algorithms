const Node = require('./node');

class Grid {
    constructor(nRows, nCols, startRow, startCol) {
        this.nRows = nRows;
        this.nCols = nCols;
        this.startRow = startRow;
        this.startCol = startCol;
        this.nodes = [];
    }

    draw() {
        const grid = document.createElement('div');
        grid.id = 'grid';
        grid.className = 'grid';

        grid.style.width = '800px';
        grid.style.height = '800px';

        for (let row = 0; row < this.nRows; row++) {
            for (let col = 0; col < this.nCols; col++) {
                let node = new Node(grid);
                if (row == this.startRow && col == this.startCol) {
                    node.setAsStartNode();
                }
                this.nodes.push(node);
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

    getNode(row, col) {
        return this.nodes[row * this.nCols + col];
    }

    setDimensions(rows, cols) {
        this.nRows = rows;
        this.nCols = cols;
    }

    setStartNode(row, col) {
        this.startRow = row;
        this.startCol = col;
        this.getNode(row, col).setAsStartNode();
    }

    setEndNode(row, col) {
        this.endRow = row;
        this.endCol = col;
    }

    _createNode(row, col) {
        const node = document.createElement('div');
        node.style.width = '8px';
        node.style.height = '8px';
        node.className = 'node';
        node.id = `n${row * this.nCols + col}`;
        return node;
    }
}

module.exports = Grid;
