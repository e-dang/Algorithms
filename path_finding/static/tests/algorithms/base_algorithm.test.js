const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

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
});
