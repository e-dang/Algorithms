const GridController = require('../src/grid_controller');
const Grid = require('../src/grid');
const Dijkstra = require('../src/algorithms/dijkstra');

jest.mock('../src/grid');

describe('GridControllerTest', () => {
    const nRows = 10;
    const nCols = 14;
    const startRow = 1;
    const startCol = 1;
    const endRow = 1;
    const endCol = 1;
    const alg = "Dijkstra's Algorithm";
    let controller;

    beforeEach(() => {
        controller = new GridController(nRows, nCols, startRow, startCol, endRow, endCol, alg);
    });

    test('constructor initializes a new Grid with the passed in dimensions', () => {
        expect(Grid).toHaveBeenCalledWith(nRows, nCols, startRow, startCol, endRow, endCol);
    });

    test('constructor sets alg parameter to alg property', () => {
        expect(controller.alg).toBe(alg);
    });

    test('_parseInput splits string at comma and returns two ints', () => {
        const input = document.createElement('input');
        input.value = '10,11';

        const [first, second] = controller._parseInput(input);

        expect(first).toBe(10);
        expect(second).toBe(11);
    });

    test('_handleUpdateGrid is called when submit button is pressed', () => {
        button = document.createElement('button');
        button.id = 'submitButton';
        document.body.appendChild(button);
        controller._handleUpdateGrid = jest.fn();
        controller.addUpdateGridEventListener();

        button.click();

        expect(controller._handleUpdateGrid).toHaveBeenCalledTimes(1);
    });

    test('_handleUpdateGrid calls _handleUpdateTable and reset on grid', () => {
        controller._handleUpdateTable = jest.fn();
        const [rows, cols, startRow, startCol, endRow, endCol] = [20, 20, 15, 15, 10, 9];
        controller._parseInput = jest
            .fn()
            .mockReturnValueOnce([rows, cols])
            .mockReturnValueOnce([startRow, startCol])
            .mockReturnValueOnce([endRow, endCol]);

        controller._handleUpdateGrid();

        expect(controller.grid.reset).toHaveBeenCalledWith(rows, cols, startRow, startCol, endRow, endCol);
        expect(controller._handleUpdateTable).toHaveBeenCalledWith(rows, cols, startRow, startCol, endRow, endCol);
    });

    test('_handleUpdateTable sets textContent', () => {
        document.body.innerHTML = `<table id="gridInfo" class="table">
            <tr>
                <th></th>
                <th>Row</th>
                <th>Column</th>
            </tr>
            <tr>
                <td>Start Node</td>
                <td id="startRow">-1</td>
                <td id="startCol">-1</td>
            </tr>
            <tr>
                <td>End Node</td>
                <td id="endRow">-1</td>
                <td id="endCol">-1</td>
            </tr>
            <tr>
                <td>Dimensions</td>
                <td id="rows">-1</td>
                <td id="cols">-1</td>
            </tr>
        </table>`;

        const [rows, cols, startRow, startCol, endRow, endCol] = ['20', '20', '15', '15', '10', '9'];
        controller._handleUpdateTable(rows, cols, startRow, startCol, endRow, endCol);

        expect(document.getElementById('rows').textContent).toBe(rows);
        expect(document.getElementById('cols').textContent).toBe(cols);
        expect(document.getElementById('startRow').textContent).toBe(startRow);
        expect(document.getElementById('startCol').textContent).toBe(startCol);
        expect(document.getElementById('endRow').textContent).toBe(endRow);
        expect(document.getElementById('endCol').textContent).toBe(endCol);
    });

    test('_algorithmFromString returns Dijkstra when Dijkstra.name is the alg property', () => {
        controller.alg = "Dijkstra's Algorithm";

        expect(controller._algorithmFromString()).toBeInstanceOf(Dijkstra);
    });

    test('_handleRunAlgorithm calls _algorithmFromString and run on its return value', () => {
        const mockReturn = {run: jest.fn()};
        controller._algorithmFromString = jest.fn().mockReturnValueOnce(mockReturn);

        controller._handleRunAlgorithm();

        expect(controller._algorithmFromString).toHaveBeenCalledTimes(1);
        expect(mockReturn.run).toHaveBeenCalledTimes(1);
        expect(mockReturn.run).toHaveBeenCalledWith(controller.grid.drawPath);
    });
});
