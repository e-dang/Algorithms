const Grid = require('../src/grid');
const Node = require('../src/node');

jest.mock('../src/node');

describe('TestGrid', () => {
    const nRows = 10;
    const nCols = 20;
    const startRow = 1;
    const startCol = 1;
    const endRow = 8;
    const endCol = 15;
    let grid;

    beforeEach(() => {
        const wrapper = document.createElement('div');
        wrapper.id = 'gridWrapper';
        document.body.append(wrapper);
        grid = new Grid(nRows, nCols, startRow, startCol, endRow, endCol);
    });

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    });

    test('constructor sets nRows, nCols, startRow, startCol, endRow, endCol properties', () => {
        expect(grid.nRows).toBe(nRows);
        expect(grid.nCols).toBe(nCols);
        expect(grid.startRow).toBe(startRow);
        expect(grid.startCol).toBe(startCol);
        expect(grid.endRow).toBe(endRow);
        expect(grid.endCol).toBe(endCol);
    });

    test('draw constructs a grid element and constructs nRows * nCols Nodes with it', () => {
        grid.draw();

        expect(document.getElementById('grid')).toBeTruthy();
        expect(Node).toHaveBeenCalledTimes(nRows * nCols);
        expect(Node).toHaveBeenCalledWith(document.getElementById('grid'));
    });

    test('draw push nRows * nCols Nodes to node property', () => {
        grid.nodes.push = jest.fn();

        grid.draw();

        expect(grid.nodes.push).toHaveBeenCalledTimes(nRows * nCols);
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

    test('getNode returns the correct node', () => {
        const row = 1;
        const col = 4;
        let node;
        const div = document.createElement('div');
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < nCols; j++) {
                let newNode = new Node(div);
                grid.nodes.push(newNode);
                if (i == row && j == col) {
                    node = newNode;
                }
            }
        }

        expect(grid.getNode(row, col)).toBe(node);
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
        grid.getNode = jest.fn();
        grid.getNode.mockReturnValueOnce(new Node());

        grid.setStartNode(row, col);

        expect(grid.startRow).toBe(row);
        expect(grid.startCol).toBe(col);
    });

    test('setStartNode calls setAsStartNode on correct node', () => {
        const row = 0;
        const col = 6;
        for (let i = 0; i < 10; i++) {
            grid.nodes.push(new Node());
        }

        grid.setStartNode(row, col);

        expect(grid.getNode(row, col).setAsStartNode).toHaveBeenCalledTimes(1);
    });

    test('setEndNode sets endRow and endCol', () => {
        const row = 10;
        const col = 9;
        grid.getNode = jest.fn();
        grid.getNode.mockReturnValueOnce(new Node());

        grid.setEndNode(row, col);

        expect(grid.endRow).toBe(row);
        expect(grid.endCol).toBe(col);
    });

    test('setEndNode calls setAsEndNode on correct node', () => {
        const row = 0;
        const col = 6;
        for (let i = 0; i < 10; i++) {
            grid.nodes.push(new Node());
        }

        grid.setEndNode(row, col);

        expect(grid.getNode(row, col).setAsEndNode).toHaveBeenCalledTimes(1);
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

    test('clear resets nodes property to empty list', () => {
        const obj = {remove: jest.fn()};
        document.getElementById = jest.fn((x) => obj);
        grid.nodes = [new Node()];

        grid.clear();

        expect(grid.nodes.length).toBe(0);
    });

    test('_handleMouseMove calls setColor if isMouseDown is true', () => {
        const node = new Node();
        grid.isMouseDown = true;
        grid.setNodeType = 'setAsWallNode';

        grid._handleMouseMove(node);

        expect(node[grid.setNodeType]).toHaveBeenCalled();
    });

    test('_handleClick calls toggleNodeType', () => {
        const node = new Node();

        grid._handleClick(node);

        expect(node.toggleNodeType).toHaveBeenCalledTimes(1);
    });

    test('_handleMouseDown sets isMouseDown to true', () => {
        const mockFn = jest.fn((x) => 0);
        const event = {target: {id: {substring: mockFn}}};
        grid.nodes = [new Node()];
        grid.isMouseDown = false;

        grid._handleMouseDown(event);

        expect(grid.isMouseDown).toBe(true);
    });

    test('_handleMouseDown sets setNodeType to opposite of node type', () => {
        const mockFn = jest.fn((x) => 0);
        const event = {target: {id: {substring: mockFn}}};
        const node = new Node();
        node.isWallNode.mockReturnValueOnce(true);
        grid.nodes = [node];

        grid._handleMouseDown(event);

        expect(grid.setNodeType).toBe('setAsEmptyNode');
    });

    test('_handleMouseUp sets isMouseDown to false', () => {
        grid.isMouseDown = true;

        grid._handleMouseUp();

        expect(grid.isMouseDown).toBe(false);
    });

    test('getNodeFromPoint', () => {
        let node;
        const nodeNum = 57;
        for (let i = 0; i < nRows * nCols; i++) {
            const newNode = new Node();
            grid.nodes.push(newNode);
            if (i == nodeNum) {
                node = newNode;
            }
        }
        grid.nodeHeight = 8;
        grid.nodeWidth = 8;
        const row = Math.floor(nodeNum / nCols);
        const col = nodeNum - row * nCols;
        const x = col * grid.nodeWidth + 1;
        const y = row * grid.nodeHeight + 1;

        expect(grid.getNodeFromPoint(x, y)).toBe(node);
    });
});
