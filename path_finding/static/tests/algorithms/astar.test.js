const AStarSearch = require('../../src/algorithms/astar');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/algorithms/base_algorithm');

describe('TestAStarSearch', () => {
    let alg;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        alg = new AStarSearch(grid);
    });

    test('constructor calls parent constructor with grid param', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid);
    });

    test('calcHeuristic returns euclidean distance', () => {
        const node1 = {
            row: 10,
            col: 3,
        };
        const node2 = {
            row: 6,
            col: 17,
        };

        const retVal = alg.calcHeuristic(node1, node2);

        expect(retVal).toBeCloseTo(14.56, 3);
    });
});
