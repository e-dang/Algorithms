const MinHeap = require('../../src/utils/min_heap');

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

    test('_get calls keyExtractor with value at index', () => {
        const val = 1;
        heap.heap.push(val);
        heap.keyExtractor = jest.fn((x) => x);

        const retVal = heap._get(0);

        expect(retVal).toBe(val);
        expect(heap.keyExtractor).toHaveBeenCalledTimes(1);
    });

    test('isEmpty returns true when heap is empty', () => {
        const retVal = heap.isEmpty();

        expect(retVal).toBe(true);
    });

    test('insertions maintain heap order', () => {
        heap.insert(10);
        heap.insert(9);
        heap.insert(8);
        heap.insert(7);
        heap.insert(6);

        expect(heap.heap).toEqual([6, 7, 9, 10, 8]);
    });

    test('pop removes minimum and maintains heap order', () => {
        heap.heap = [6, 7, 9, 10, 8];

        expect(heap.pop()).toBe(6);
        expect(heap.heap).toEqual([7, 8, 9, 10]);

        expect(heap.pop()).toBe(7);
        expect(heap.heap).toEqual([8, 10, 9]);

        expect(heap.pop()).toBe(8);
        expect(heap.heap).toEqual([9, 10]);

        expect(heap.pop()).toBe(9);
        expect(heap.heap).toEqual([10]);

        expect(heap.pop()).toBe(10);
        expect(heap.heap).toEqual([]);
    });

    test('pop returns undefined when heap is empty', () => {
        expect(heap.pop()).toBe(undefined);
    });

    describe('tests with integer value nodes', () => {
        beforeEach(() => {
            heap.heap.push(8);
            heap.heap.push(9);
            heap.heap.push(10);
        });

        test('_getParent returns parent value', () => {
            const retVal = heap._getParent(1);

            expect(retVal).toBe(8);
        });

        test('_getLeftChild returns left child value', () => {
            const retVal = heap._getLeftChild(0);

            expect(retVal).toBe(9);
        });

        test('_getRightChild returns right child value', () => {
            const retVal = heap._getRightChild(0);

            expect(retVal).toBe(10);
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
            const retVal = heap._hasLeftChild(1);

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
            const length = heap.heap.push(-1);

            heap._heapifyUp(length - 1);

            expect(heap.heap).toEqual([-1, 8, 10, 9]);
        });

        test('_heapifyDown percolates value at top down to correct position', () => {
            heap.heap[0] = 12;

            heap._heapifyDown(0);

            expect(heap.heap).toEqual([9, 12, 10]);
        });

        test('isEmpty returns false when not empty', () => {
            const retVal = heap.isEmpty();

            expect(retVal).toBe(false);
        });
    });
});
