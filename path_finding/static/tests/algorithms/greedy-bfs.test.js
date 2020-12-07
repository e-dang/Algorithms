const GreedyBestFirstSearch = require('../../src/algorithms/greedy-bfs');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/algorithms/base_algorithm');

describe('TestGreedyBestFirstSearch', () => {
    let alg;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        alg = new GreedyBestFirstSearch(grid);
    });

    test('constructor calls parent constructor with grid param', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid);
    });
});
