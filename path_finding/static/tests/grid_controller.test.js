const GridController = require('../src/grid_controller');
const Grid = require('../src/grid');

jest.mock('../src/grid');

describe('GridControllerTest', () => {
    const nRows = 10;
    const nCols = 14;
    const startRow = 1;
    const startCol = 1;
    const endRow = 1;
    const endCol = 1;
    let controller;

    beforeEach(() => {
        controller = new GridController(nRows, nCols, startRow, startCol, endRow, endCol);
    });

    test('constructor initializes a new Grid with the passed in dimensions', () => {
        expect(Grid).toHaveBeenCalledWith(nRows, nCols, startRow, startCol, endRow, endCol);
    });

    test('_parseInput splits string at comma and returns two ints', () => {
        const input = document.createElement('input');
        input.value = '10,11';

        const [first, second] = controller._parseInput(input);

        expect(first).toBe(10);
        expect(second).toBe(11);
    });

    describe('updating grid', () => {
        let button;

        beforeEach(() => {
            button = document.createElement('button');
            button.id = 'submitButton';
            document.body.appendChild(button);
        });

        test('_handleUpdateGrid is called when submit button is pressed', () => {
            controller._handleUpdateGrid = jest.fn();
            controller.addUpdateGridEventListener();

            button.click();

            expect(controller._handleUpdateGrid).toHaveBeenCalledTimes(1);
        });

        test('_handleUpdateGrid calls reset on grid', () => {
            const dimInput = document.createElement('input');
            const startNodeInput = document.createElement('input');
            const endNodeInput = document.createElement('input');
            dimInput.id = 'dimensionsInput';
            startNodeInput.id = 'startNodeInput';
            endNodeInput.id = 'endNodeInput';
            dimInput.value = '20,20';
            startNodeInput.value = '15,15';
            endNodeInput.value = '10,9';
            document.body.appendChild(dimInput);
            document.body.appendChild(startNodeInput);
            document.body.appendChild(endNodeInput);
            controller.grid.reset = jest.fn();

            controller._handleUpdateGrid();

            expect(controller.grid.reset).toHaveBeenCalledWith(20, 20, 15, 15, 10, 9);
        });
    });
});
