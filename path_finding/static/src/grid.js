const Node = require('./node');
const utils = require('./utils/utils');
class Grid {
    constructor(nRows, nCols, startRow, startCol, endRow, endCol, weight) {
        this.nRows = nRows;
        this.nCols = nCols;
        this.startRow = startRow;
        this.startCol = startCol;
        this.endRow = endRow;
        this.endCol = endCol;
        this.weight = weight;
        this.isMouseDown = false;
        this.isAlgRunning = false;
        this.setNodeType = null;
        this.isWeightToggleOn = false;
        this.gridWrapper = document.getElementById('gridWrapper');
        this.nodes = [];
    }

    draw() {
        const grid = document.createElement('tbody');
        grid.id = 'grid';
        grid.className = 'algorithm-grid';

        for (let row = 0; row < this.nRows; row++) {
            const gridRow = document.createElement('tr');
            grid.appendChild(gridRow);
            for (let col = 0; col < this.nCols; col++) {
                const idx = row * this.nCols + col;
                let node = new Node(row, col, idx, gridRow);
                if (row == this.startRow && col == this.startCol) {
                    node.setAsStartNode();
                } else if (row == this.endRow && col == this.endCol) {
                    node.setAsEndNode();
                }
                node.addEventListener('mousemove', () => this._handleMouseMove(node));
                node.addEventListener('click', () => this._handleClick(node));
                this.nodes.push(node);
            }
        }

        grid.addEventListener('mousedown', (event) => this._handleMouseDown(event));
        grid.addEventListener('mouseup', () => this._handleMouseUp());

        this.gridWrapper.appendChild(grid);
    }

    async drawPath() {
        let node = this.getEndNode().prev;
        while (node != null) {
            await utils.sleep(10);
            node.setAsPathNode();
            node = node.prev;
        }
    }

    reset(nRows, nCols) {
        this.startRow = Math.floor(nRows * 0.1);
        this.startCol = Math.floor(nCols * 0.1);
        this.endRow = Math.ceil(nRows * 0.9) - 1;
        this.endCol = Math.ceil(nCols * 0.9) - 1;
        this.setDimensions(nRows, nCols);
        this.clear();
        this.draw();
    }

    clear() {
        document.getElementById('grid').remove();
        this.nodes = [];
    }

    clearPath() {
        this.nodes.forEach((node) => node.reset());
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

    setAsStartNode(node) {
        if (!node.isEndNode()) {
            this.getStartNode().setAsEmptyNode(true, false);
            this.startRow = node.row;
            this.startCol = node.col;
            node.setAsStartNode();
        }
    }

    setAsEndNode(node) {
        if (!node.isStartNode()) {
            this.getEndNode().setAsEmptyNode(true, false);
            this.endRow = node.row;
            this.endCol = node.col;
            node.setAsEndNode();
        }
    }

    isInvalidSpace(row, col) {
        if (row < 0 || row >= this.nRows || col < 0 || col >= this.nCols || this.getNode(row, col).isWallNode()) {
            return true;
        }
        return false;
    }

    _handleMouseMove(node) {
        if (this.isMouseDown && !this.isAlgRunning) {
            this.setNodeType(node);
        }
    }

    _handleClick(node) {
        if (!this.isAlgRunning) {
            if (this.isWeightToggleOn && !node.isWeightNode()) {
                node.setAsWeightNode(this.weight);
            } else if (!this.isWeightToggleOn && !node.isWallNode()) {
                node.setAsWallNode();
            } else {
                node.setAsEmptyNode();
            }
        }
    }

    _handleMouseDown(event) {
        this.isMouseDown = true;
        const node = this.nodes[event.target.id.substring(1)];
        if (node.isStartNode()) {
            this.setNodeType = this.setAsStartNode;
        } else if (node.isEndNode()) {
            this.setNodeType = this.setAsEndNode;
        } else if (this.isWeightToggleOn && !node.isWeightNode()) {
            this.setNodeType = (currNode) => currNode.setAsWeightNode(this.weight);
        } else if (!this.isWeightToggleOn && !node.isWallNode()) {
            this.setNodeType = (currNode) => currNode.setAsWallNode();
        } else {
            this.setNodeType = (currNode) => currNode.setAsEmptyNode();
        }
    }

    _handleMouseUp() {
        this.isMouseDown = false;
    }
}

module.exports = Grid;
