const Node = require('./node');

class Grid {
    constructor(nRows, nCols, startRow, startCol, endRow, endCol) {
        this.nRows = nRows;
        this.nCols = nCols;
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
        this.isMouseDown = false;
        this.setNodeType = 'setAsWallNode';
        this.gridWrapper = document.getElementById('gridWrapper');
        this.nodes = [];
    }

    draw() {
        const grid = document.createElement('div');
        grid.id = 'grid';
        grid.className = 'algorithm-grid';

        const nodeWidth = Math.floor(this.gridWrapper.offsetWidth / this.nCols);
        const nodeHeight = Math.floor(this.gridWrapper.offsetHeight / this.nRows);

        grid.style.width = nodeWidth * this.nCols + 'px';
        grid.style.height = nodeHeight * this.nRows + 'px';
        grid.nodeWidth = nodeWidth - 1 + 'px';
        grid.nodeHeight = nodeHeight - 1 + 'px';

        for (let row = 0; row < this.nRows; row++) {
            for (let col = 0; col < this.nCols; col++) {
                let node = new Node(grid);
                if (row == this.startRow && col == this.startCol) {
                    node.setAsStartNode();
                } else if (row == this.endRow && col == this.endCol) {
                    node.setAsEndNode();
                } else {
                    node.addEventListener('mouseover', () => this._handleMouseOver(node));
                    node.addEventListener('click', () => this._handleClick(node));
                }
                this.nodes.push(node);
            }
        }

        grid.addEventListener('mousedown', () => this._handleMouseDown());
        grid.addEventListener('mouseup', () => this._handleMouseUp());

        this.gridWrapper.appendChild(grid);
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
        this.getNode(row, col).setAsEndNode();
    }

    _createNode(row, col) {
        const node = document.createElement('div');
        node.style.width = '8px';
        node.style.height = '8px';
        node.className = 'node';
        node.id = `n${row * this.nCols + col}`;
        return node;
    }

    _handleMouseOver(node) {
        if (this.isMouseDown) {
            node[this.setNodeType]();
        }
    }

    _handleClick(node) {
        node.toggleNodeType();
    }

    _handleMouseDown() {
        this.isMouseDown = true;
    }

    _handleMouseUp() {
        this.isMouseDown = false;
    }
}

module.exports = Grid;
