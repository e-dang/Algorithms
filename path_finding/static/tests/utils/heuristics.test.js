const heuristics = require('../../src/utils/heuristics');

describe('TestHeuristics', () => {
    test('l1norm returns correct distance', () => {
        const node1 = {
            row: 10,
            col: 3,
        };
        const node2 = {
            row: 6,
            col: 17,
        };

        const retVal = heuristics.l1Norm(node1, node2);

        expect(retVal).toBe(18);
    });

    test('l2norm returns correct distance', () => {
        const node1 = {
            row: 10,
            col: 3,
        };
        const node2 = {
            row: 6,
            col: 17,
        };

        const retVal = heuristics.l2Norm(node1, node2);

        expect(retVal).toBeCloseTo(14.56, 3);
    });
});
