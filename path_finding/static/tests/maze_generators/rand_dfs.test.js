const RandomizedDFS = require('../../src/maze_generators/rand_dfs');
const BaseGenerator = require('../../src/maze_generators/base_generator');

jest.mock('../../src/maze_generators/base_generator');

describe('TestRandomizedDFS', () => {
    let generator;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        generator = new RandomizedDFS(grid);
    });

    test('constructor calls BaseGenerator constructor with grid param', () => {
        expect(BaseGenerator).toHaveBeenCalledWith(grid);
    });
});
