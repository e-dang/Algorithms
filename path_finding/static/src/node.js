class Node {
    constructor(row, col, grid, cost = 1) {
        this.row = row;
        this.col = col;
        this.cost = cost;
        this.id = `n${grid.children.length}`;
        this.element = document.createElement('div');
        this.element.id = this.id;
        this.element.ondragstart = () => false;
        this.reset();
        this.setAsEmptyNode();

        grid.appendChild(this.element);
    }

    reset() {
        // for unidirectional
        this.prev = null;
        this.totalCost = Infinity;
        this.heuristicScore = Infinity;

        // for bidirectional
        this.otherPrev = null;
        this.otherTotalCost = Infinity;
        this.otherHeuristicScore = Infinity;

        this.visited = false;

        if (!this.isStartNode() && !this.isEndNode() && !this.isWallNode()) {
            this.setAsEmptyNode();
        }
    }

    setAsStartNode() {
        this._setNodeType('start');
    }

    setAsEndNode() {
        this._setNodeType('end');
    }

    setAsEmptyNode() {
        this._setNodeType('empty');
    }

    setAsWallNode() {
        if (!this.isStartNode() && !this.isEndNode()) {
            this._setNodeType('wall');
        }
    }

    setAsVisitedNode() {
        this.visited = true;
        if (!this.isStartNode() && !this.isEndNode()) {
            this._setNodeType('visited');
        }
    }

    setAsVisitingNode() {
        if (!this.isStartNode() && !this.isEndNode()) {
            this._setNodeType('visiting');
        }
    }

    setAsPathNode() {
        if (!this.isStartNode()) {
            this._setNodeType('path');
        }
    }

    addEventListener(eventType, callback) {
        this.element.addEventListener(eventType, callback);
    }

    isWallNode() {
        return this.element.className == 'node wall';
    }

    isStartNode() {
        return this.element.className == 'node start';
    }

    isEndNode() {
        return this.element.className == 'node end';
    }

    toggleNodeType() {
        if (this.isWallNode()) {
            this.setAsEmptyNode();
        } else {
            this.setAsWallNode();
        }
    }

    _setNodeType(type) {
        this.element.className = '';
        this.element.classList.add('node', type);
    }
}

module.exports = Node;
