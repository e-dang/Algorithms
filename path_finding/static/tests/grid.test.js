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
        });

        test('draw constructs a grid element and constructs nRows * nCols Nodes with it', () => {
            grid.draw();

            expect(document.getElementById('grid')).toBeTruthy();
            expect(Node).toHaveBeenCalledTimes(nRows * nCols);
        });

        test('draw push nRows * nCols Nodes to node property', () => {
            grid.nodes.push = jest.fn();

            grid.draw();

            expect(grid.nodes.push).toHaveBeenCalledTimes(nRows * nCols);
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

    test('setAsStartNode sets startRow and startCol', () => {
        const node = new Node();
        node.isEndNode.mockReturnValueOnce(false);
        grid.getStartNode = jest.fn().mockReturnValueOnce(new Node());
        node.row = 1;
        node.col = 0;

        grid.setAsStartNode(node);

        expect(grid.startRow).toBe(node.row);
        expect(grid.startCol).toBe(node.col);
    });

    test('setAsStartNode calls setAsStartNode on node', () => {
        const node = new Node();
        node.isEndNode.mockReturnValueOnce(false);
        grid.getStartNode = jest.fn().mockReturnValueOnce(new Node());

        grid.setAsStartNode(node);

        expect(node.setAsStartNode).toHaveBeenCalledTimes(1);
    });

    test('setAsStartNode sets previous startNode to empty node', () => {
        const node = new Node();
        grid.getStartNode = jest.fn().mockReturnValueOnce(node);
        const nodeParam = new Node();
        nodeParam.isEndNode.mockReturnValueOnce(false);

        grid.setAsStartNode(nodeParam);

        expect(node.setAsEmptyNode).toHaveBeenCalledTimes(1);
    });

    test('setAsStartNode doesnt set startRow and startCol if node.isEndNode returns true', () => {
        const node = new Node();
        node.row = 9;
        node.col = 9;
        node.isEndNode.mockReturnValueOnce(true);
        grid.getStartNode = jest.fn().mockReturnValueOnce(new Node());

        grid.setAsStartNode(node);

        expect(grid.startRow).toBe(startRow);
        expect(grid.startCol).toBe(startCol);
    });

    test('setAsEndNode sets endRow and endCol', () => {
        const node = new Node();
        node.isStartNode.mockReturnValueOnce(false);
        grid.getEndNode = jest.fn().mockReturnValueOnce(new Node());
        node.row = 1;
        node.col = 0;

        grid.setAsEndNode(node);

        expect(grid.endRow).toBe(node.row);
        expect(grid.endCol).toBe(node.col);
    });

    test('setAsEndNode calls setAsEndNode on node', () => {
        const node = new Node();
        grid.getEndNode = jest.fn().mockReturnValueOnce(new Node());

        grid.setAsEndNode(node);

        expect(node.setAsEndNode).toHaveBeenCalledTimes(1);
    });

    test('setAsEndNode sets previous startNode to empty node', () => {
        const node = new Node();
        grid.getEndNode = jest.fn().mockReturnValueOnce(node);
        const nodeParam = new Node();
        nodeParam.isStartNode.mockReturnValueOnce(false);

        grid.setAsEndNode(nodeParam);

        expect(node.setAsEmptyNode).toHaveBeenCalledTimes(1);
    });

    test('setAsEndNode doesnt set endRow and endCol if isStartNode returns true', () => {
        const node = new Node();
        node.row = 1;
        node.col = 3;
        node.isStartNode.mockReturnValueOnce(true);
        grid.getEndNode = jest.fn().mockReturnValueOnce(new Node());

        grid.setAsEndNode(node);

        expect(grid.endRow).toBe(endRow);
        expect(grid.endCol).toBe(endCol);
    });

    describe('test reset', () => {
        beforeEach(() => {
            grid.setDimensions = jest.fn();
            grid.clear = jest.fn();
            grid.draw = jest.fn();
        });

        test('reset calls setDimensions args', () => {
            const [rows, cols] = [15, 15];

            grid.reset(rows, cols);

            expect(grid.setDimensions).toHaveBeenCalledWith(rows, cols);
        });

        test('reset calls clear', () => {
            grid.reset(1, 1);

            expect(grid.clear).toHaveBeenCalledTimes(1);
        });

        test('reset calls draw', () => {
            grid.reset(1, 1);

            expect(grid.draw).toHaveBeenCalledTimes(1);
        });
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

    test('_handleMouseMove calls setNodeType with node if isMouseDown is true and isAlgRunning is false', () => {
        const node = new Node();
        grid.isMouseDown = true;
        grid.isAlgRunning = false;
        grid.setNodeType = jest.fn();

        grid._handleMouseMove(node);

        expect(grid.setNodeType).toHaveBeenCalledWith(node);
        expect(grid.setNodeType).toHaveBeenCalledTimes(1);
    });

    test('_handleMouseMove doesnt call setNodeType with node if isMouseDown is false', () => {
        const node = new Node();
        grid.isMouseDown = false;
        grid.isAlgRunning = false;
        grid.setNodeType = jest.fn();

        grid._handleMouseMove(node);

        expect(grid.setNodeType).not.toHaveBeenCalled();
    });

    test('_handleMouseMove doesnt call setNodeType with node if isAlgRunning is true', () => {
        const node = new Node();
        grid.isMouseDown = true;
        grid.isAlgRunning = true;
        grid.setNodeType = jest.fn();

        grid._handleMouseMove(node);

        expect(grid.setNodeType).not.toHaveBeenCalled();
    });

    test('_handleClick calls toggleNodeType when isAlgRunning is false', () => {
        const node = new Node();
        grid.isAlgRunning = false;

        grid._handleClick(node);

        expect(node.toggleNodeType).toHaveBeenCalledTimes(1);
    });

    test('_handleClick doesnt call toggleNodeType when isAlgRunning is true', () => {
        const node = new Node();
        grid.isAlgRunning = true;

        grid._handleClick(node);

        expect(node.toggleNodeType).not.toHaveBeenCalled();
    });

    test('_handleMouseDown sets isMouseDown to true', () => {
        const mockFn = jest.fn((x) => 0);
        const event = {target: {id: {substring: mockFn}}};
        grid.nodes = [new Node()];
        grid.isMouseDown = false;

        grid._handleMouseDown(event);

        expect(grid.isMouseDown).toBe(true);
    });

    test('_handleMouseDown sets setNodeType to func that sets node as empty node when node is a wall node', () => {
        const mockFn = jest.fn((x) => 0);
        const event = {target: {id: {substring: mockFn}}};
        const node = new Node();
        node.isWallNode.mockReturnValueOnce(true);
        grid.nodes = [node];

        grid._handleMouseDown(event);
        grid.setNodeType(node);

        expect(node.setAsEmptyNode).toHaveBeenCalledTimes(1);
    });

    test('_handleMouseDown sets setNodeType to func that sets node as wall node when node is a empty node', () => {
        const mockFn = jest.fn((x) => 0);
        const event = {target: {id: {substring: mockFn}}};
        const node = new Node();
        node.isWallNode.mockReturnValueOnce(false);
        node.isStartNode.mockReturnValueOnce(false);
        node.isEndNode.mockReturnValueOnce(false);
        grid.nodes = [node];

        grid._handleMouseDown(event);
        grid.setNodeType(node);

        expect(node.setAsWallNode).toHaveBeenCalledTimes(1);
    });

    test('_handleMouseDown sets setNodeType to setAsStartNode when node is a start node', () => {
        const mockFn = jest.fn((x) => 0);
        const event = {target: {id: {substring: mockFn}}};
        const node = new Node();
        node.isWallNode.mockReturnValueOnce(false);
        node.isStartNode.mockReturnValueOnce(true);
        grid.nodes = [node];

        grid._handleMouseDown(event);

        expect(grid.setNodeType).toBe(grid.setAsStartNode);
    });

    test('_handleMouseDown sets setNodeType to setAsEndNode when node is a end node', () => {
        const mockFn = jest.fn((x) => 0);
        const event = {target: {id: {substring: mockFn}}};
        const node = new Node();
        node.isWallNode.mockReturnValueOnce(false);
        node.isStartNode.mockReturnValueOnce(false);
        node.isEndNode.mockReturnValueOnce(true);
        grid.nodes = [node];

        grid._handleMouseDown(event);

        expect(grid.setNodeType).toBe(grid.setAsEndNode);
    });

    test('_handleMouseUp sets isMouseDown to false', () => {
        grid.isMouseDown = true;

        grid._handleMouseUp();

        expect(grid.isMouseDown).toBe(false);
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

    test('clearPath calls reset on all nodes', () => {
        for (let i = 0; i < nRows; i++) {
            grid.nodes.push(new Node());
        }

        grid.clearPath();

        for (let i = 0; i < nRows; i++) {
            expect(grid.nodes[i].reset).toHaveBeenCalledTimes(1);
        }
    });
});
