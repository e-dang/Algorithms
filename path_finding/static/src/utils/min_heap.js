class HeapNode {
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
    }
}
class MinHeap {
    constructor(keyExtractor = (node) => node) {
        this.priorityCount = 0;
        this.heap = [];
        this.keyExtractor = keyExtractor;
    }

    insert(val) {
        this._heapifyUp(this.heap.push(new HeapNode(val, this.priorityCount)) - 1);
        this.priorityCount += 1;
    }

    pop() {
        if (this.isEmpty()) {
            return undefined;
        }

        const item = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.splice(this.heap.length - 1);
        this._heapifyDown(0);
        return item.data;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    _heapifyDown(index) {
        while (this._hasLeftChild(index)) {
            let smallChildIdx = this._getLeftChildIndex(index);

            if (
                this._hasRightChild(index) &&
                (this._getRightChildValue(index) < this._getLeftChildValue(index) ||
                    (this._getRightChildValue(index) === this._getLeftChildValue(index) &&
                        this._getRightChildPriority(index) > this._getLeftChildPriority(index)))
            ) {
                smallChildIdx = this._getRightChildIndex(index);
            }

            const currVal = this._getValue(index);
            const childVal = this._getValue(smallChildIdx);
            if (
                currVal < childVal ||
                (currVal === childVal && this._getPriority(index) > this._getPriority(smallChildIdx))
            ) {
                break;
            }

            this._swap(index, smallChildIdx);
            index = smallChildIdx;
        }
    }

    _heapifyUp(index) {
        while (
            this._hasParent(index) &&
            (this._getParentValue(index) > this._getValue(index) ||
                (this._getParentValue(index) === this._getValue(index) &&
                    this._getParentPriority(index) < this._getPriority(index)))
        ) {
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
        return this.heap[index].data;
    }

    _getValue(index) {
        return this.keyExtractor(this._get(index));
    }

    _getPriority(index) {
        return this.heap[index].priority;
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

    _getLeftChildValue(index) {
        return this._getValue(this._getLeftChildIndex(index));
    }

    _getRightChildValue(index) {
        return this._getValue(this._getRightChildIndex(index));
    }

    _getParentValue(index) {
        return this._getValue(this._getParentIndex(index));
    }

    _getParentPriority(index) {
        return this._getPriority(this._getParentIndex(index));
    }

    _getLeftChildPriority(index) {
        return this._getPriority(this._getLeftChildIndex(index));
    }

    _getRightChildPriority(index) {
        return this._getPriority(this._getRightChildIndex(index));
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

module.exports = {
    HeapNode,
    MinHeap,
};
