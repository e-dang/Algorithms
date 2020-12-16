const BidirectionalSearch = require('../../src/algorithms/bidirectional');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/algorithms/base_algorithm');

describe('TestBidirectionalSearch', () => {
    let alg;
    let grid;
    let moves;

    beforeEach(() => {
        moves = jest.fn();
        grid = jest.fn();
        alg = new BidirectionalSearch(grid, moves);
    });

    test('constructor calls parent constructor with grid and moves param', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid, moves);
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
