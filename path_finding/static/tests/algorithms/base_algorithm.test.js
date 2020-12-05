const BaseAlgorithm = require('../../src/algorithms/base_algorithm');
const Node = require('../../src/node');

jest.mock('../../src/node');

describe('TestBaseAlgorithm', () => {
    let alg;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        alg = new BaseAlgorithm(grid);
    });

    test('constructor sets grid property to grid parameter', () => {
        expect(alg.grid).toBe(grid);
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
