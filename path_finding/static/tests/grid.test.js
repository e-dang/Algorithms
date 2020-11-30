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

    describe('test draw method', () => {
        let mockSetter;
        beforeEach(() => {
            mockSetter = jest.fn();
            grid._setGridWidthHeight = mockSetter;
        });

        test('draw constructs a grid element and constructs nRows * nCols Nodes with it', () => {
            grid.draw();

            expect(document.getElementById('grid')).toBeTruthy();
            expect(Node).toHaveBeenCalledTimes(nRows * nCols);
            expect(Node).toHaveBeenCalledWith(0, 0, document.getElementById('grid'));
        });

        test('draw push nRows * nCols Nodes to node property', () => {
            grid.nodes.push = jest.fn();

            grid.draw();

            expect(grid.nodes.push).toHaveBeenCalledTimes(nRows * nCols);
        });

        test('draw calls _setGridWidthHeight', () => {
            grid.draw();

            expect(mockSetter).toHaveBeenCalledWith(document.getElementById('grid'));
        });
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

    test('setNodeAsStartNode sets startRow and startCol', () => {
        const node = new Node();
        grid.getStartNode = jest.fn().mockReturnValueOnce(new Node());
        node.row = 1;
        node.col = 0;

        grid.setNodeAsStartNode(node);

        expect(grid.startRow).toBe(node.row);
        expect(grid.startCol).toBe(node.col);
    });

    test('setNodeAsStartNode calls setAsStartNode on node', () => {
        const node = new Node();
        grid.getStartNode = jest.fn().mockReturnValueOnce(new Node());

        grid.setNodeAsStartNode(node);

        expect(node.setAsStartNode).toHaveBeenCalledTimes(1);
    });

    test('setNodeAsStartNode sets previous startNode to empty node', () => {
        const node = new Node();
        grid.getStartNode = jest.fn().mockReturnValueOnce(node);

        grid.setNodeAsStartNode(new Node());

        expect(node.setAsEmptyNode).toHaveBeenCalledTimes(1);
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

    test('setNodeAsEndNode sets endRow and endCol', () => {
        const node = new Node();
        grid.getEndNode = jest.fn().mockReturnValueOnce(new Node());
        node.row = 1;
        node.col = 0;

        grid.setNodeAsEndNode(node);

        expect(grid.endRow).toBe(node.row);
        expect(grid.endCol).toBe(node.col);
    });

    test('setNodeAsEndNode calls setAsEndNode on node', () => {
        const node = new Node();
        grid.getEndNode = jest.fn().mockReturnValueOnce(new Node());

        grid.setNodeAsEndNode(node);

        expect(node.setAsEndNode).toHaveBeenCalledTimes(1);
    });

    test('setNodeAsEndNode sets previous startNode to empty node', () => {
        const node = new Node();
        grid.getEndNode = jest.fn().mockReturnValueOnce(node);

        grid.setNodeAsEndNode(new Node());

        expect(node.setAsEmptyNode).toHaveBeenCalledTimes(1);
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

    describe('test clear method', () => {
        beforeEach(() => {
            const gridDiv = document.createElement('div');
            gridDiv.id = 'grid';
            document.body.appendChild(gridDiv);
        });

        test('clear removes the grid element', () => {
            grid.clear();

            expect(document.getElementById('grid')).toBeNull();
        });

        test('clear resets nodes property to empty list', () => {
            grid.nodes = [new Node()];

            grid.clear();

            expect(grid.nodes.length).toBe(0);
        });
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

    describe('test _setGridWidthHeight', () => {
        let node;
        let mockGrid;

        beforeEach(() => {
            node = document.createElement('div');
            node.className = 'node';
            document.body.appendChild(node);
            grid.nodes.push({element: node});
            mockGrid = {style: {width: undefined, height: undefined}};
        });

        test('_setGridWidthHeight sets grid width to nCols * nodeWidth', () => {
            const widthPx = getComputedStyle(node).width;
            const nodeWidth = parseInt(widthPx.substring(0, widthPx.length - 1));

            grid._setGridWidthHeight(mockGrid);

            expect(mockGrid.style.width).toBe(`${grid.nCols * (nodeWidth + 1)}px`);
        });

        test('_setGridWidthHeight sets grid height to nRows * nodeHeight', () => {
            const heightPx = getComputedStyle(node).height;
            const nodeHeight = parseInt(heightPx.substring(0, heightPx.length - 1));

            grid._setGridWidthHeight(mockGrid);

            expect(mockGrid.style.height).toBe(`${grid.nRows * (nodeHeight + 1)}px`);
        });
    });

    test('isInvalidSpace returns true when row < 0', () => {
        const row = -1;
        const col = 0;

        const result = grid.isInvalidSpace(row, col);

        expect(result).toBe(true);
    });

    test('isInvalidSpace returns true when row >= nRows', () => {
        const row = nRows + 1;
        const col = 0;

        const result = grid.isInvalidSpace(row, col);

        expect(result).toBe(true);
    });

    test('isInvalidSpace returns true when col < 0', () => {
        const row = 0;
        const col = -1;

        const result = grid.isInvalidSpace(row, col);

        expect(result).toBe(true);
    });

    test('isInvalidSpace returns true when col >= nCols', () => {
        const row = 0;
        const col = nCols + 1;

        const result = grid.isInvalidSpace(row, col);

        expect(result).toBe(true);
    });

    test('isInvalidSpace returns true node at coords is a wall node', () => {
        const node = new Node();
        node.isWallNode = jest.fn().mockReturnValueOnce(true);
        grid.nodes.push(node);
        const row = 0;
        const col = 0;

        const result = grid.isInvalidSpace(row, col);

        expect(result).toBe(true);
    });

    test('isInvalidSpace returns false on valid information', () => {
        const node = new Node();
        node.isWallNode = jest.fn().mockReturnValueOnce(false);
        grid.nodes.push(node);
        const row = 0;
        const col = 0;

        const result = grid.isInvalidSpace(row, col);

        expect(result).toBe(false);
    });

    test('getStartNode returns node at start coordinates', () => {
        let node;
        for (i = 0; i < nRows * nCols; i++) {
            const newNode = new Node();
            grid.nodes.push(newNode);
            if (i == startRow * nCols + startCol) {
                node = newNode;
            }
        }

        const result = grid.getStartNode();

        expect(result).toBe(node);
    });

    test('getStartNode returns node at end coordinates', () => {
        let node;
        for (i = 0; i < nRows * nCols; i++) {
            const newNode = new Node();
            grid.nodes.push(newNode);
            if (i == endRow * nCols + endCol) {
                node = newNode;
            }
        }

        const result = grid.getEndNode();

        expect(result).toBe(node);
    });

    test('drawPath calls setAsPathNode on linked list of nodes starting at end node prev', () => {
        node1 = new Node();
        node2 = new Node();
        node3 = new Node();
        node3.prev = node2;
        node2.prev = node1;
        node1.prev = null;
        grid.nodes = [node1, node2, node3];
        grid.endRow = 0;
        grid.endCol = 2;

        grid.drawPath();

        expect(node3.setAsPathNode).not.toHaveBeenCalled();
        expect(node2.setAsPathNode).toHaveBeenCalledTimes(1);
        expect(node1.setAsPathNode).toHaveBeenCalledTimes(1);
    });

    test('drawPath doesnt call setAsPathNode when end nodes prev is null', () => {
        node1 = new Node();
        node2 = new Node();
        node3 = new Node();
        node3.prev = null;
        node2.prev = node1;
        node1.prev = null;
        grid.nodes = [node1, node2, node3];
        grid.endRow = 0;
        grid.endCol = 2;

        grid.drawPath();

        expect(node3.setAsPathNode).not.toHaveBeenCalled();
        expect(node2.setAsPathNode).not.toHaveBeenCalled();
        expect(node1.setAsPathNode).not.toHaveBeenCalled();
    });
});
