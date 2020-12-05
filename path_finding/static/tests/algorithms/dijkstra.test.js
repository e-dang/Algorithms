const Dijkstra = require('../../src/algorithms/dijkstra');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/algorithms/base_algorithm');

describe('TestDijkstra', () => {
    let grid;
    let alg;

    beforeEach(() => {
        grid = jest.fn();
        alg = new Dijkstra(grid);
    });

    test('constructor calls parent constructor', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid);
    });
});
