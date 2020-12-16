const RandomWeightMaze = require('../../src/maze_generators/rand_weight_maze');
const BaseGenerator = require('../../src/maze_generators/base_generator');

jest.mock('../../src/maze_generators/base_generator');

describe('TestRandomWeightMaze', () => {
    let generator;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        generator = new RandomWeightMaze(grid);
    });

    test('constructor calls BaseGenerators constructor with grid param', () => {
        expect(BaseGenerator).toHaveBeenCalledWith(grid);
    });
});
