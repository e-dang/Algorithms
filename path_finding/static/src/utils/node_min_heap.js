const MinHeap = require('./min_heap');

class NodeMinHeap extends MinHeap {
    constructor(key = 'distance') {
        super((node) => node[key]);
        this.key = key;
        this.map = {};
    }

    insert(node) {
        this.map[node.id] = this.heap.length;
        super.insert(node);
    }

    pop() {
        const retVal = super.pop();
        if (retVal === undefined) {
            return retVal;
        }

        this.map[retVal.id] = undefined;
        if (!this.isEmpty()) {
            this.map[this.heap[0].id] = 0;
        }

        return retVal;
    }

    update(node, val) {
        const tmp = node[this.key];
        const idx = this.map[node.id];
        node[this.key] = val;

        if (val < tmp) {
            this._heapifyUp(idx);
        } else {
            this._heapifyDown(idx);
        }
    }

    contains(node) {
        return node.id in this.map;
    }

    _swap(idx1, idx2) {
        this.map[this.heap[idx1].id] = idx2;
        this.map[this.heap[idx2].id] = idx1;
        super._swap(idx1, idx2);
    }
}

module.exports = NodeMinHeap;
