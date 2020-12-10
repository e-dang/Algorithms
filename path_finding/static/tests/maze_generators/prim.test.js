const RandomizedPrims = require('../../src/maze_generators/prim');
const BaseGenerator = require('../../src/maze_generators/base_generator');

jest.mock('../../src/maze_generators/base_generator');

describe('TestRandomizedPrims', () => {
    let generator;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        generator = new RandomizedPrims(grid);
    });

    test('constructor calls BaseGenerator constructor with grid param', () => {
        expect(BaseGenerator).toHaveBeenCalledWith(grid);
    });
});
