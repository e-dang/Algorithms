const Grid = require('../grid');

describe('TestGrid', () => {
    const nRows = 10;
    const nCols = 20;
    let grid;

    beforeEach(() => {
        grid = new Grid(nRows, nCols);
    });

    test('grid constructor sets nRows and nCols properties', () => {
        expect(grid.nRows).toBe(nRows);
        expect(grid.nCols).toBe(nCols);
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
});
