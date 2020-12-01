class MinHeap {
    constructor(keyExtractor = (node) => node) {
        this.heap = [];
        this.keyExtractor = keyExtractor;
    }

    insert(val) {
        this._heapifyUp(this.heap.push(val) - 1);
    }

    pop() {
        if (this.isEmpty()) {
            return undefined;
        }

        const item = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.splice(this.heap.length - 1);
        this._heapifyDown(0);
        return item;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    _heapifyDown(index) {
        while (this._hasLeftChild(index)) {
            let smallChildIdx = this._getLeftChildIndex(index);

            if (this._hasRightChild(index) && this._getRightChild(index) < this._getLeftChild(index)) {
                smallChildIdx = this._getRightChildIndex(index);
            }

            if (this._get(index) < this._get(smallChildIdx)) {
                break;
            }

            this._swap(index, smallChildIdx);
            index = smallChildIdx;
        }
    }

    _heapifyUp(index) {
        while (this._hasParent(index) && this._getParent(index) > this._get(index)) {
            this._swap(index, this._getParentIndex(index));
            index = this._getParentIndex(index);
        }
    }

    _swap(idx1, idx2) {
        const temp = this.heap[idx1];
        this.heap[idx1] = this.heap[idx2];
        this.heap[idx2] = temp;
    }

    _get(index) {
        return this.keyExtractor(this.heap[index]);
    }

    _hasLeftChild(index) {
        return this._getLeftChildIndex(index) < this.heap.length;
    }

    _hasRightChild(index) {
        return this._getRightChildIndex(index) < this.heap.length;
    }

    _hasParent(index) {
        return this._getParentIndex(index) >= 0;
    }

    _getLeftChild(index) {
        return this._get(this._getLeftChildIndex(index));
    }

    _getRightChild(index) {
        return this._get(this._getRightChildIndex(index));
    }

    _getParent(index) {
        return this._get(this._getParentIndex(index));
    }

    _getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    _getRightChildIndex(index) {
        return 2 * index + 2;
    }

    _getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }
}

module.exports = MinHeap;
