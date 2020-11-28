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

        for (let row = 0; row < this.nRows; row++) {
            for (let col = 0; col < this.nCols; col++) {
                let node = new Node(grid);
                if (row == this.startRow && col == this.startCol) {
                    node.setAsStartNode();
                } else if (row == this.endRow && col == this.endCol) {
                    node.setAsEndNode();
                } else {
                    node.addEventListener('mousemove', () => this._handleMouseMove(node));
                    node.addEventListener('click', () => this._handleClick(node));
                }
                this.nodes.push(node);
            }
        }

        grid.addEventListener('mousedown', (event) => this._handleMouseDown(event));
        grid.addEventListener('mouseup', () => this._handleMouseUp());

        this.gridWrapper.appendChild(grid);
        this._setGridWidthHeight(grid);
    }

    drawPath() {
        let node = this.getEndNode().prev;
        while (node != null) {
            node.setAsPathNode();
            node = node.prev;
        }
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
        this.nodes = [];
    }

    getNode(row, col) {
        return this.nodes[row * this.nCols + col];
    }

    getStartNode() {
        return this.getNode(this.startRow, this.startCol);
    }

    getEndNode() {
        return this.getNode(this.endRow, this.endCol);
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

    isInvalidSpace(row, col) {
        if (row < 0 || row >= this.nRows || col < 0 || col >= this.nCols || this.getNode(row, col).isWallNode()) {
            return true;
        }
        return false;
    }

    _handleMouseMove(node) {
        if (this.isMouseDown) {
            node[this.setNodeType]();
        }
    }

    _handleClick(node) {
        node.toggleNodeType();
    }

    _handleMouseDown(event) {
        this.isMouseDown = true;
        const node = this.nodes[event.target.id.substring(1)];
        this.setNodeType = node.isWallNode() ? 'setAsEmptyNode' : 'setAsWallNode';
    }

    _handleMouseUp() {
        this.isMouseDown = false;
    }

    _setGridWidthHeight(grid) {
        const style = window.getComputedStyle(this.nodes[0].element);
        let width = style.getPropertyValue('width');
        let height = style.getPropertyValue('height');
        width = parseInt(width.substring(0, width.length - 1));
        height = parseInt(height.substring(0, height.length - 1));

        grid.style.width = (width + 1) * this.nCols + 'px';
        grid.style.height = (height + 1) * this.nRows + 'px';
    }
}

module.exports = Grid;
