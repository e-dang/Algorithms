const RandomizedDFS = require('../../src/maze_generators/rand_dfs');

describe('TestRandomizedDFS', () => {
    let generator;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        generator = new RandomizedDFS(grid);
    });

    test('constructor sets grid prop to grid param', () => {
        expect(generator.grid).toBe(grid);
    });
});
