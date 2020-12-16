const Dijkstra = require('../../src/algorithms/dijkstra');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/algorithms/base_algorithm');

describe('TestDijkstra', () => {
    let grid;
    let alg;
    let moves;

    beforeEach(() => {
        moves = jest.fn();
        grid = jest.fn();
        alg = new Dijkstra(grid, moves);
    });

    test('constructor calls parent constructor with grid and moves param', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid, moves);
    });
});
