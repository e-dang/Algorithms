const RandomMaze = require('../../src/maze_generators/random');
const BaseGenerator = require('../../src/maze_generators/base_generator');

jest.mock('../../src/maze_generators/base_generator');

describe('TestRandomMaze', () => {
    let generator;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        generator = new RandomMaze(grid);
    });

    test('constructor calls BaseGenerator constructor', () => {
        expect(BaseGenerator).toHaveBeenCalledWith(grid);
    });
});
