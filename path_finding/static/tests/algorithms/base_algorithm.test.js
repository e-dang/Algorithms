const BaseAlgorithm = require('../../src/algorithms/base_algorithm');
const Node = require('../../src/node').Node;

jest.mock('../../src/node');

describe('TestBaseAlgorithm', () => {
    let alg;
    let grid;
    let moves;

    beforeEach(() => {
        grid = jest.fn();
        moves = {dr: 1, dc: 2};
        alg = new BaseAlgorithm(grid, moves);
    });

    test('constructor sets grid property to grid parameter', () => {
        expect(alg.grid).toBe(grid);
    });

    test('constructor updates props with moves param', () => {
        expect(alg.dr).toBe(1);
        expect(alg.dc).toBe(2);
    });

    test('visit calls setAsVisitedNode on node', async () => {
        const node = new Node();

        await alg.visit(node);

        expect(node.setAsVisitedNode).toHaveBeenCalledTimes(1);
    });

    test('visiting calls setAsVisitingNode on node', async () => {
        const node = new Node();

        await alg.visiting(node);

        expect(node.setAsVisitingNode).toHaveBeenCalledTimes(1);
    });
});
