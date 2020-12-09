const MinHeap = require('../../src/utils/min_heap').MinHeap;
const HeapNode = require('../../src/utils/min_heap').HeapNode;

const extractData = (nodes) => {
    return nodes.map((node) => node.data);
};

const extractPriority = (nodes) => {
    return nodes.map((node) => node.priority);
};

describe('TestHeapNode', () => {
    let node;
    let data;
    let priority;

    beforeEach(() => {
        data = 1;
        priority = 2;
        node = new HeapNode(data, priority);
    });

    test('constructor sets data prop equal to data parameter', () => {
        expect(node.data).toBe(data);
    });

    test('constructor sets priority prop equal to priority parameter', () => {
        expect(node.priority).toBe(priority);
    });
});

describe('TestMinHeap', () => {
    let heap;

    beforeEach(() => {
        heap = new MinHeap();
    });

    test('constructor sets keyExtractor to default function', () => {
        expect(heap.keyExtractor).toBeInstanceOf(Function);
    });

    test('constructor sets keyExtractor property to keyExtractor param', () => {
        const keyExtractor = (node) => node.totalCost;

        heap = new MinHeap(keyExtractor);

        expect(heap.keyExtractor).toBe(keyExtractor);
    });

    test('_getLeftChildIndex returns correct index', () => {
        const retVal = heap._getLeftChildIndex(3);

        expect(retVal).toBe(7);
    });

    test('_getRightChildIndex returns correct index', () => {
        const retVal = heap._getRightChildIndex(3);

        expect(retVal).toBe(8);
    });

    test('_getParentIndex returns correct index', () => {
        const retVal = heap._getParentIndex(3);

        expect(retVal).toBe(1);
    });

    test('isEmpty returns true when heap is empty', () => {
        const retVal = heap.isEmpty();

        expect(retVal).toBe(true);
    });

    test('pop returns undefined when heap is empty', () => {
        expect(heap.pop()).toBe(undefined);
    });

    describe('tests with inserted nodes', () => {
        beforeEach(() => {
            heap.insert(10);
            heap.insert(9);
            heap.insert(8);
            heap.insert(7);
            heap.insert(6);
        });

        test('insertions maintain heap order', () => {
            expect(extractData(heap.heap)).toEqual([6, 7, 9, 10, 8]);
        });

        test('pop removes minimum and maintains heap order', () => {
            expect(heap.pop()).toBe(6);
            expect(extractData(heap.heap)).toEqual([7, 8, 9, 10]);

            expect(heap.pop()).toBe(7);
            expect(extractData(heap.heap)).toEqual([8, 10, 9]);

            expect(heap.pop()).toBe(8);
            expect(extractData(heap.heap)).toEqual([9, 10]);

            expect(heap.pop()).toBe(9);
            expect(extractData(heap.heap)).toEqual([10]);

            expect(heap.pop()).toBe(10);
            expect(heap.heap).toEqual([]);
        });

        test('_getParentValue returns parent value', () => {
            const retVal = heap._getParentValue(1);

            expect(retVal).toBe(6);
        });

        test('_getLeftChildValue returns left child value', () => {
            const retVal = heap._getLeftChildValue(0);

            expect(retVal).toBe(7);
        });

        test('_getRightChildValue returns right child value', () => {
            const retVal = heap._getRightChildValue(0);

            expect(retVal).toBe(9);
        });

        test('_hasParent returns true when node has a parent', () => {
            const retVal = heap._hasParent(1);

            expect(retVal).toBe(true);
        });

        test('_hasParent returns false when node is root', () => {
            const retVal = heap._hasParent(0);

            expect(retVal).toBe(false);
        });

        test('_hasLeftChild returns true when node has a left child', () => {
            const retVal = heap._hasLeftChild(0);

            expect(retVal).toBe(true);
        });

        test('_hasLeftChild returns false when node doesnt have a left child', () => {
            const retVal = heap._hasLeftChild(4);

            expect(retVal).toBe(false);
        });

        test('_hasRightChild returns true when node has a right child', () => {
            const retVal = heap._hasRightChild(0);

            expect(retVal).toBe(true);
        });

        test('_hasRightChild returns false when node doesnt have a right child', () => {
            const retVal = heap._hasRightChild(2);

            expect(retVal).toBe(false);
        });

        test('_getValue calls keyExtractor with node data at index', () => {
            heap.keyExtractor = jest.fn((x) => x);

            const retVal = heap._getValue(0);

            expect(retVal).toBe(6);
            expect(heap.keyExtractor).toHaveBeenCalledTimes(1);
            expect(heap.keyExtractor).toHaveBeenCalledWith(6);
        });

        test('_swap switches positions of two nodes', () => {
            const idx1 = 0;
            const idx2 = 2;
            const valIdx1Before = heap.heap[idx1];
            const valIdx2Before = heap.heap[idx2];

            heap._swap(idx1, idx2);

            expect(heap.heap[idx1]).toBe(valIdx2Before);
            expect(heap.heap[idx2]).toBe(valIdx1Before);
        });

        test('_heapifyUp percolates value at idx up to correct position', () => {
            const length = heap.heap.push(new HeapNode(-1, 5));

            heap._heapifyUp(length - 1);

            expect(extractData(heap.heap)).toEqual([-1, 7, 6, 10, 8, 9]);
        });

        test('_heapifyDown percolates value at top down to correct position', () => {
            heap.heap[0].data = 12;

            heap._heapifyDown(0);

            expect(extractData(heap.heap)).toEqual([7, 8, 9, 10, 12]);
        });

        test('isEmpty returns false when not empty', () => {
            const retVal = heap.isEmpty();

            expect(retVal).toBe(false);
        });

        test('_getPriority returns the priority of the node at given index', () => {
            const retVal = heap._getPriority(0);

            expect(retVal).toBe(4);
        });

        test('_get returns the node data at index', () => {
            const retVal = heap._get(0);

            expect(retVal).toBe(heap.heap[0].data);
        });

        test('_getParentPriority returns the priority of parent node', () => {
            const retVal = heap._getParentPriority(3);

            expect(retVal).toBe(3);
        });

        test('_getLeftChildPriority returns the priority of parent node', () => {
            const retVal = heap._getLeftChildPriority(0);

            expect(retVal).toBe(3);
        });

        test('_getRightChildPriority returns the priority of parent node', () => {
            const retVal = heap._getRightChildPriority(0);

            expect(retVal).toBe(1);
        });
    });

    describe('test with duplicate inserted values', () => {
        beforeEach(() => {
            heap.insert(1);
            heap.insert(1);
            heap.insert(1);
            heap.insert(1);
        });

        test('insertion maintains priority order', () => {
            expect(extractPriority(heap.heap)).toEqual([3, 2, 1, 0]);
        });

        test('pop removes in priority order', () => {
            heap.pop();
            expect(extractPriority(heap.heap)).toEqual([2, 0, 1]);

            heap.pop();
            expect(extractPriority(heap.heap)).toEqual([1, 0]);

            heap.pop();
            expect(extractPriority(heap.heap)).toEqual([0]);
        });

        test('_heapifyUp percolates new duplicate to top of heap', () => {
            const newNode = new HeapNode(1, 4);
            heap.heap.push(newNode);

            heap._heapifyUp(heap.heap.length - 1);

            expect(heap.heap[0]).toBe(newNode);
        });

        test('_heapifyDown percolates low priority duplicate to bottom', () => {
            heap.heap[0] = heap.heap[heap.heap.length - 1];
            heap.heap.splice(heap.heap.length - 1, 1);

            heap._heapifyDown(0);

            expect(extractPriority(heap.heap)).toEqual([2, 0, 1]);
        });
    });
});
