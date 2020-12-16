const MAX_WEIGHT = 20;
const MIN_WEIGHT = 2;
const EMPTY_WEIGHT = 1;
class Node {
    constructor(row, col, idx, gridRow) {
        this.row = row;
        this.col = col;
        this.weight = EMPTY_WEIGHT;
        this.id = `n${idx}`;
        this.element = document.createElement('td');
        this.element.id = this.id;
        this.element.ondragstart = () => false;
        this.reset();

        gridRow.appendChild(this.element);
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

        if (this.weight !== EMPTY_WEIGHT) {
            this.setAsWeightNode(this.weight, false);
        } else if (!this.isStartNode() && !this.isEndNode() && !this.isWallNode() && !this.isWeightNode()) {
            this.setAsEmptyNode(false, false);
        }
    }

    resetWeight() {
        this.weight = EMPTY_WEIGHT;
        this.element.style.opacity = 1;
    }

    setAsStartNode() {
        this.resetWeight();
        this._setNodeType('start');
    }

    setAsEndNode() {
        this.resetWeight();
        this._setNodeType('end');
    }

    setAsEmptyNode(force = false, animation = true) {
        if (force || (!this.isStartNode() && !this.isEndNode())) {
            this.resetWeight();
            if (animation) {
                this._setNodeType(['animatedEmpty', 'empty']);
            } else {
                this._setNodeType('empty');
            }
        }
    }

    setAsWallNode(animation = true) {
        if (!this.isStartNode() && !this.isEndNode()) {
            this.resetWeight();
            if (animation) {
                this._setNodeType(['animatedWall', 'wall']);
            } else {
                this._setNodeType('wall');
            }
        }
    }

    setAsWeightNode(weight, animation = true) {
        if (!this.isStartNode() && !this.isEndNode() && weight <= MAX_WEIGHT && weight >= MIN_WEIGHT) {
            this.weight = weight;
            this.element.style.opacity = weight / MAX_WEIGHT;
            if (animation) {
                this._setNodeType(['animatedWeight', 'weight']);
            } else {
                this._setNodeType('weight');
            }
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
        return this.element.classList.contains('wall');
    }

    isWeightNode() {
        return this.element.classList.contains('weight');
    }

    isStartNode() {
        return this.element.classList.contains('start');
    }

    isEndNode() {
        return this.element.classList.contains('end');
    }

    _setNodeType(type) {
        this.element.className = '';
        if (Array.isArray(type)) {
            this.element.classList.add('node', ...type);
        } else {
            this.element.classList.add('node', type);
        }
    }
}

module.exports = {Node, MAX_WEIGHT, MIN_WEIGHT};
