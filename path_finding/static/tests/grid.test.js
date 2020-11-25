const Grid = require('../src/grid');

describe('TestGrid', () => {
    const nRows = 10;
    const nCols = 20;
    const startRow = 1;
    const startCol = 1;
    let grid;

    beforeEach(() => {
        grid = new Grid(nRows, nCols, startRow, startCol);
    });

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    });

    test('grid constructor sets nRows, nCols, startRow, startCol properties', () => {
        expect(grid.nRows).toBe(nRows);
        expect(grid.nCols).toBe(nCols);
        expect(grid.startRow).toBe(startRow);
        expect(grid.startCol).toBe(startCol);
    });

    test('draw adds grid element to body of the document with correct dimensions', () => {
        grid.draw();

        expect(document.getElementById('grid')).toBeTruthy();
        expect(document.getElementById('grid').children.length).toBe(nRows * nCols);
    });

    test('_createNode creates a node with className "node"', () => {
        const node = grid._createNode(3, 4);

        expect(node.className).toBe('node');
    });

    test('_createNode creates a node with id dependent on row, col', () => {
        const row = 3;
        const col = 4;

        const node = grid._createNode(row, col);

        expect(node.id).toBe(`n${row * nCols + col}`);
    });

    test('setDimensions sets nRows and nCols', () => {
        const rows = 1;
        const cols = 2;

        grid.setDimensions(rows, cols);

        expect(grid.nRows).toBe(rows);
        expect(grid.nCols).toBe(cols);
    });

    test('setStartNode sets startRow and startCol', () => {
        const row = 10;
        const col = 9;

        grid.setStartNode(row, col);

        expect(grid.startRow).toBe(row);
        expect(grid.startCol).toBe(col);
    });

    test('setEndNode sets endRow and endCol', () => {
        const row = 10;
        const col = 9;

        grid.setEndNode(row, col);

        expect(grid.endRow).toBe(row);
        expect(grid.endCol).toBe(col);
    });

    test('reset calls setDimensions, setStartNode, setEndNode, and draw with right args', () => {
        grid.setDimensions = jest.fn();
        grid.setStartNode = jest.fn();
        grid.setEndNode = jest.fn();
        grid.clear = jest.fn();
        grid.draw = jest.fn();
        const [rows, cols, startRow, startCol, endRow, endCol] = [15, 15, 10, 8, 1, 2];

        grid.reset(rows, cols, startRow, startCol, endRow, endCol);

        expect(grid.setDimensions).toHaveBeenCalledWith(rows, cols);
        expect(grid.setStartNode).toHaveBeenCalledWith(startRow, startCol);
        expect(grid.setEndNode).toHaveBeenCalledWith(endRow, endCol);
        expect(grid.clear).toHaveBeenCalledTimes(1);
        expect(grid.draw).toHaveBeenCalledTimes(1);
    });

    test('clear removes the grid element', () => {
        grid.draw();

        grid.clear();

        expect(document.getElementById('grid')).toBeNull();
    });
});
