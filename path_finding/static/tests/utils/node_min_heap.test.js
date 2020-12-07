const NodeMinHeap = require('../../src/utils/node_min_heap');

const createPsuedoNode = (val) => {
    return {totalCost: val, id: `${val}`};
};

const createPsuedoNodes = (vals) => {
    return vals.map((val) => createPsuedoNode(val));
};

describe('TestModeMinHeap', () => {
    let heap;

    beforeEach(() => {
        heap = new NodeMinHeap();
    });

    test('constructor can take optional key prop to extract the ordering val off a node', () => {
        const key = 'randomProp';
        node = {randomProp: 1289};
        heap = new NodeMinHeap(key);

        const retVal = heap.keyExtractor(node);

        expect(retVal).toBe(1289);
    });

    test('pop remove minimum and maintains heap order', () => {
        heap.heap = createPsuedoNodes([6, 7, 9, 10, 8]);

        expect(heap.pop()).toEqual(createPsuedoNode(6));
        expect(heap.heap).toEqual(createPsuedoNodes([7, 8, 9, 10]));

        expect(heap.pop()).toEqual(createPsuedoNode(7));
        expect(heap.heap).toEqual(createPsuedoNodes([8, 10, 9]));

        expect(heap.pop()).toEqual(createPsuedoNode(8));
        expect(heap.heap).toEqual(createPsuedoNodes([9, 10]));

        expect(heap.pop()).toEqual(createPsuedoNode(9));
        expect(heap.heap).toEqual(createPsuedoNodes([10]));

        expect(heap.pop()).toEqual(createPsuedoNode(10));
        expect(heap.heap).toEqual(createPsuedoNodes([]));
    });

    test('pop returns undefined if empty', () => {
        const retVal = heap.pop();

        expect(retVal).toBe(undefined);
    });

    test('contains returns true when node is in heap', () => {
        const node = createPsuedoNode(1);
        heap.insert(node);

        const retVal = heap.contains(node);

        expect(retVal).toBe(true);
    });

    test('contains returns false when node is not in heap', () => {
        const node = createPsuedoNode(1);

        const retVal = heap.contains(node);

        expect(retVal).toBe(false);
    });

    describe('tests with inserted nodes', () => {
        beforeEach(() => {
            const nodes = createPsuedoNodes([10, 9, 8, 7, 6]);
            nodes.forEach((node) => heap.insert(node));
        });

        test('insertions maintain heap order', () => {
            const expected = createPsuedoNodes([6, 7, 9, 10, 8]);

            expect(heap.heap).toEqual(expected);
        });

        test('update reorders nodes upward correctly', () => {
            const node = heap.heap[3];
            const expected = createPsuedoNodes([-1, 6, 9, 7, 8]);
            expected[0] = node;

            heap.update(node, -1);

            expect(heap.heap).toEqual(expected);
        });

        test('update reorders nodes downward correctly', () => {
            const node = heap.heap[1];
            const expected = createPsuedoNodes([6, 8, 9, 10, 12]);
            expected[expected.length - 1] = node;

            heap.update(node, 12);

            expect(heap.heap).toEqual(expected);
        });
    });
});
