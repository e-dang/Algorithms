const DFS = require('../../src/algorithms/dfs');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');
const Node = require('../../src/node').Node;

jest.mock('../../src/algorithms/base_algorithm');
jest.mock('../../src/node');

describe('TestDFS', () => {
    let alg;
    let grid;
    let moves;

    beforeEach(() => {
        moves = jest.fn();
        grid = jest.fn();
        alg = new DFS(grid, moves);
    });

    test('constructor calls BaseAlgorithm constructor with grid and moves params', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid, moves);
    });

    test('visit sets node prev to prevNode', async () => {
        const node = new Node();
        const prevNode = new Node();

        await alg.visit(node, prevNode);

        expect(node.prev).toBe(prevNode);
    });
});
