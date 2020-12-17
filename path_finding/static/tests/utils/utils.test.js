const utils = require('../../src/utils/utils');

describe('TestUtils', () => {
    // let mockRandom;

    beforeEach(() => {
        // mockRandom
        Math.random = jest.fn().mockReturnValueOnce(0.6);
    });

    test('getRandOdd returns an odd number when param is odd', () => {
        const retVal = utils.getRandOdd(9);

        expect(retVal % 2).toBe(1);
    });

    test('getRandOdd returns an odd number when param is even', () => {
        const retVal = utils.getRandOdd(10);

        expect(retVal % 2).toBe(1);
    });

    test('getRandOdd returns a number <= parameter', () => {
        const param = 10;

        const retVal = utils.getRandOdd(param);

        expect(retVal <= 10).toBe(true);
    });

    test('getRandEven returns an even number when param is odd', () => {
        const retVal = utils.getRandEven(9);

        expect(retVal % 2).toBe(0);
    });

    test('getRandEven returns an even number when param is even', () => {
        const retVal = utils.getRandEven(10);

        expect(retVal % 2).toBe(0);
    });

    test('getRandEven returns a number <= parameter', () => {
        const param = 10;

        const retVal = utils.getRandEven(param);

        expect(retVal <= 10).toBe(true);
    });
});
