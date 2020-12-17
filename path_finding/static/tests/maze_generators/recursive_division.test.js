const RecursiveDivision = require('../../src/maze_generators/recursive_division');
const BaseGenerator = require('../../src/maze_generators/base_generator');
const Node = require('../../src/node').Node;

jest.mock('../../src/maze_generators/base_generator');
jest.mock('../../src/node');

describe('TestRecursiveDivision', () => {
    let generator;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        generator = new RecursiveDivision(grid);
    });

    test('constructor calls BaseGenerators constructor with grid param', () => {
        expect(BaseGenerator).toHaveBeenCalledWith(grid);
    });

    test('_isNextWallHorizontal returns true when width < height', () => {
        const retVal = generator._isNextWallHorizontal(1, 2);

        expect(retVal).toBe(true);
    });

    test('_isNextWallHorizontal returns false when height > width', () => {
        const retVal = generator._isNextWallHorizontal(2, 1);

        expect(retVal).toBe(false);
    });

    test('_isNextWallHorizontal returns falsy when height == width and Math.random returns <0.5', () => {
        Math.random = jest.fn().mockReturnValueOnce(0.4);

        const retVal = generator._isNextWallHorizontal(1, 1);

        expect(retVal).toBeFalsy();
    });

    test('_isNextWallHorizontal returns truthy when height == width and Math.random returns >=0.5', () => {
        Math.random = jest.fn().mockReturnValueOnce(0.51);

        const retVal = generator._isNextWallHorizontal(1, 1);

        expect(retVal).toBeTruthy();
    });

    test('_drawLine calls setAsWallNode on each return value of getNode', async () => {
        const nodes = [new Node(), new Node(), new Node()];
        nodes.forEach((node) => node.isWallNode.mockReturnValueOnce(false));
        const mockGetNode = jest.fn((idx) => nodes[idx]);

        await generator._drawLine(mockGetNode, 0, nodes.length - 1);

        nodes.forEach((node) => {
            expect(node.setAsWallNode).toHaveBeenCalledTimes(1);
        });
    });
});
