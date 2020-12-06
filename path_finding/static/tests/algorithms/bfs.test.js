const BFS = require('../../src/algorithms/bfs');
const Node = require('../../src/node');
const BaseAlgorithm = require('../../src/algorithms/base_algorithm');

jest.mock('../../src/node');
jest.mock('../../src/algorithms/base_algorithm');

describe('TestBFS', () => {
    let alg;
    let grid;

    beforeEach(() => {
        grid = jest.fn();
        alg = new BFS(grid);
    });

    test('constructor calls parent constructor with grid param', () => {
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

        test('visiting sets node distance to cost parameter', async () => {
            alg.visiting(node, cost, prevNode);

            expect(node.distance).toBe(cost);
        });

        test('visiting sets node prev to prevNode parameter', async () => {
            alg.visiting(node, cost, prevNode);

            expect(node.prev).toBe(prevNode);
        });
    });
});
