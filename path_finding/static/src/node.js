class Node {
    constructor(grid) {
        this.element = document.createElement('div');
        this.setAsEmptyNode();
        this.element.id = `n${grid.children.length}`;
        this.element.style.height = '8px';
        this.element.style.width = '8px';

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

    _setNodeType(type) {
        this.element.className = '';
        this.element.classList.add('node', type);
    }
}

module.exports = Node;
