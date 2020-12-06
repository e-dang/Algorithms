const DFS = require('../../src/algorithms/dfs');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');
const Node = require('../../src/node');

jest.mock('../../src/algorithms/base_algorithm');
jest.mock('../../src/node');

describe('TestDFS', () => {
    let alg;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        alg = new DFS(grid);
    });

    test('constructor sets grid parameter as grid property', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid);
    });

    test('visit sets node prev to prevNode', async () => {
        const node = new Node();
        const prevNode = new Node();

        await alg.visit(node, prevNode);

        expect(node.prev).toBe(prevNode);
    });
});
