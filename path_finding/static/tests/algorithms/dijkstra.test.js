const Dijkstra = require('../../src/algorithms/dijkstra');
const Node = require('../../src/node');

jest.mock('../../src/node');

describe('TestDijkstra', () => {
    grid = jest.fn();
    let alg;

    beforeEach(() => {
        alg = new Dijkstra(grid);
    });

    test('constructor sets grid param to grid property', () => {
        expect(alg.grid).toBe(grid);
    });

    test('getMinimum returns node with minimum distance', () => {
        minNode = {distance: 1};
        const nodes = [{distance: 100}, minNode, {distance: Infinity}];

        const node = alg.getMinimum(nodes);

        expect(node).toBe(minNode);
    });

    test('visit calls setAsVisitedNode on node', async () => {
        const node = new Node();

        await alg.visit(node);

        expect(node.setAsVisitedNode).toHaveBeenCalledTimes(1);
    });

    test('visiting calls setAsVisitingNode on node', async () => {
        const node = new Node();

        await alg.visiting(node);

        expect(node.setAsVisitingNode).toHaveBeenCalledTimes(1);
    });
});
