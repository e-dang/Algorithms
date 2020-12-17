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

    test('constructor sets drawLine prop to _drawWallLine when useWalls param is true', () => {
        generator = new RecursiveDivision(grid, true);

        expect(generator.drawLine).toBe(generator._drawWallLine);
    });

    test('constructor sets drawLine prop to _drawWeightLine when useWalls param is false', () => {
        generator = new RecursiveDivision(grid, false);

        expect(generator.drawLine).toBe(generator._drawWeightLine);
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

    test('_drawWallLine calls setAsWallNode on each return value of getNode', async () => {
        const nodes = [new Node(), new Node(), new Node()];
        const mockGetNode = jest.fn((idx) => nodes[idx]);

        await generator._drawWallLine(mockGetNode, 0, nodes.length - 1);

        nodes.forEach((node) => {
            expect(node.setAsWallNode).toHaveBeenCalledTimes(1);
        });
    });

    test('_drawWallLine skips calling setAsWallNode on node at skipIdx', async () => {
        const nodes = [new Node(), new Node(), new Node()];
        const mockGetNode = jest.fn((idx) => nodes[idx]);

        await generator._drawWallLine(mockGetNode, 0, nodes.length - 1, 1);

        expect(nodes[0].setAsWallNode).toHaveBeenCalledTimes(1);
        expect(nodes[1].setAsWallNode).not.toHaveBeenCalled();
        expect(nodes[2].setAsWallNode).toHaveBeenCalledTimes(1);
    });

    test('_drawWeightLine calls setAsWeightNode on each return value of getNode', async () => {
        const nodes = [new Node(), new Node(), new Node()];
        const mockGetNode = jest.fn((idx) => nodes[idx]);
        generator.grid = {weight: 1};

        await generator._drawWeightLine(mockGetNode, 0, nodes.length - 1);

        nodes.forEach((node) => {
            expect(node.setAsWeightNode).toHaveBeenCalledTimes(1);
        });
    });
});
