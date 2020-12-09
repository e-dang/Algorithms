const AStarSearch = require('../../src/algorithms/astar');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/algorithms/base_algorithm');

describe('TestAStarSearch', () => {
    let alg;
    let grid;
    let heuristic;

    beforeEach(() => {
        grid = jest.fn();
        heuristic = 'stuff';
        alg = new AStarSearch(grid, heuristic);
    });

    test('constructor calls parent constructor with grid param', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid);
    });

    test('constructor sets heuristic prop to heuristic parameter', () => {
        expect(alg.heuristic).toBe(heuristic);
    });
});
