const RandomWallMaze = require('../../src/maze_generators/rand_wall_maze');
const BaseGenerator = require('../../src/maze_generators/base_generator');

jest.mock('../../src/maze_generators/base_generator');

describe('TestRandomWallMaze', () => {
    let generator;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        generator = new RandomWallMaze(grid);
    });

    test('constructor calls BaseGenerator constructor', () => {
        expect(BaseGenerator).toHaveBeenCalledWith(grid);
    });
});
