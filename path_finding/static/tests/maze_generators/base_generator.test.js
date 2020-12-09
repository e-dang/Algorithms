const BaseGenerator = require('../../src/maze_generators/base_generator');

describe('TestBaseGenerator', () => {
    let generator;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        generator = new BaseGenerator(grid);
    });

    test('constructor sets grid prop to grid param', () => {
        expect(generator.grid).toBe(grid);
    });
});
