const BidirectionalSearch = require('../../src/algorithms/bidirectional');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/algorithms/base_algorithm');

describe('TestBidirectionalSearch', () => {
    let alg;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        alg = new BidirectionalSearch(grid);
    });

    test('constructor calls parent constructor with grid param', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid);
    });

    test('buildPath connects prev pointers in doubly linked list', () => {
        const node1 = {
            prev: null,
            otherPrev: null,
        };
        const node2 = {
            prev: null,
            otherPrev: node1,
        };
        const node3 = {
            prev: null,
            otherPrev: node2,
        };

        alg.buildPath(node3);

        expect(node1.prev).toBe(node2);
        expect(node2.prev).toBe(node3);
    });
});
