class Node {
    constructor(grid) {
        this.element = document.createElement('div');
        this.element.className = 'node';
        this.element.id = `n${grid.children.length}`;
        this.element.style.height = '8px';
        this.element.style.width = '8px';

        grid.appendChild(this.element);
    }

    setAsStartNode() {
        this.element.classList.add('start');
    }
}

module.exports = Node;
