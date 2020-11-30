class Node {
    constructor(row, col, grid) {
        this.prev = null;
        this.distance = Infinity;
        this.row = row;
        this.col = col;
        this.element = document.createElement('div');
        this.setAsEmptyNode();
        this.element.id = `n${grid.children.length}`;

        grid.appendChild(this.element);
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
        this._setNodeType('wall');
    }

    setAsVisitedNode() {
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
