const DFSShortestPath = require('../../src/algorithms/dfssp');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');
const Node = require('../../src/node');

jest.mock('../../src/algorithms/base_algorithm');
jest.mock('../../src/node');

describe('TestDFSShortestPath', () => {
    let alg;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        alg = new DFSShortestPath(grid);
    });

    test('constructor sets grid parameter as grid property', () => {
        expect(BaseAlgorithm).toHaveBeenCalledWith(grid);
    });

    describe('test visiting', () => {
        let node;
        let prevNode;
        let cost;

        beforeEach(() => {
            node = new Node();
            prevNode = new Node();
            cost = 10;
        });

        test('visiting sets node totalCost to cost param', async () => {
            await alg.visiting(node, cost, prevNode);

            expect(node.totalCost).toBe(cost);
        });

        test('visiting sets node prev to prevNode', async () => {
            await alg.visiting(node, cost, prevNode);

            expect(node.prev).toBe(prevNode);
        });
    });
});
