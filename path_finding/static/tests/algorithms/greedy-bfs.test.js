const GreedyBestFirstSearch = require('../../src/algorithms/greedy-bfs');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/algorithms/base_algorithm');

describe('TestGreedyBestFirstSearch', () => {
    let alg;
    let grid;
    let heuristic;
    let moves;

    beforeEach(() => {
        moves = jest.fn();
        grid = jest.fn();
        heuristic = 'stuff';
        alg = new GreedyBestFirstSearch(grid, moves, heuristic);
    });

    test('constructor calls parent constructor with grid and moves param', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid, moves);
    });

    test('constructor sets heuristic prop to heuristic parameter', () => {
        expect(alg.heuristic).toBe(heuristic);
    });
});
