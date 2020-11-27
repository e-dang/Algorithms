class Node {
    constructor(grid) {
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

    addEventListener(eventType, callback) {
        this.element.addEventListener(eventType, callback);
    }

    isWallNode() {
        return this.element.className == 'node wall';
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
