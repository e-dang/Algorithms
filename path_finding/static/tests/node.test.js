const Node = require('../src/node');

describe('NodeTest', () => {
    let row = 3;
    let col = 1;
    let node;
    let grid;

    beforeEach(() => {
        grid = document.createElement('div');
        grid.id = 'grid';
        grid.nodeSize = '10px';
        document.body.appendChild(grid);
        node = new Node(row, col, grid);
    });

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    });

    test('constructor initializes dom element to be an empty node', () => {
        expect(node.element.className).toBe('node empty');
    });

    test('constructor sets dom element as child of grid', () => {
        expect(document.getElementById('grid').children).toContainEqual(node.element);
    });

    test('constructor sets node dom element id to "n${length of grid - 1}"', () => {
        expect(node.element.id).toBe(`n${grid.children.length - 1}`);
    });

    test('constructor sets cost prop to cost param', () => {
        const cost = 10;

        node = new Node(row, col, grid, cost);

        expect(node.cost).toBe(cost);
    });

    test('constructor sets cost prop to default 1', () => {
        expect(node.cost).toBe(1);
    });

    test('constructor initializes row property with row param', () => {
        expect(node.row).toBe(row);
    });

    test('constructor initializes col property with col param', () => {
        expect(node.col).toBe(col);
    });

    test('constructor initializes id property and element.id property as the same thing', () => {
        expect(node.id).toBe(node.element.id);
    });

    test('constructor calls reset', () => {
        const origReset = Node.prototype.reset;
        Node.prototype.reset = jest.fn();

        node = new Node(row, col, grid);

        expect(node.reset).toHaveBeenCalledTimes(1);
        Node.prototype.reset = origReset;
    });

    test('reset sets visited property to false', () => {
        node.visited = true;

        node.reset();

        expect(node.visited).toBe(false);
    });

    test('reset sets prev to null', () => {
        node.prev = {};

        node.reset();

        expect(node.prev).toBe(null);
    });

    test('reset sets totalCost to Infinity', () => {
        node.totalCost = 4;

        node.reset();

        expect(node.totalCost).toBe(Infinity);
    });

    test('reset sets heuristicScore to be undefined', () => {
        node.heuristicScore = 0;

        node.reset();

        expect(node.heuristicScore).toBe(Infinity);
    });

    test('reset sets otherPrev to null', () => {
        node.otherPrev = {};

        node.reset();

        expect(node.otherPrev).toBe(null);
    });

    test('reset sets otherTotalCost to Infinity', () => {
        node.otherTotalCost = 4;

        node.reset();

        expect(node.otherTotalCost).toBe(Infinity);
    });

    test('reset sets otherHeuristicScore to Infinity', () => {
        node.otherHeuristicScore = 0;

        node.reset();

        expect(node.otherHeuristicScore).toBe(Infinity);
    });

    test('reset sets node to empty node if node is a visited node', () => {
        node.setAsVisitedNode();

        node.reset();

        expect(node.element.className).toBe('node empty');
    });

    test('reset sets node to empty node if node is a visiting node', () => {
        node.setAsVisitingNode();

        node.reset();

        expect(node.element.className).toBe('node empty');
    });

    test('reset doesnt set node to empty node if node is a start node', () => {
        node.setAsStartNode();

        node.reset();

        expect(node.isStartNode()).toBe(true);
    });

    test('reset doesnt set node to empty node if node is an end node', () => {
        node.setAsEndNode();

        node.reset();

        expect(node.isEndNode()).toBe(true);
    });

    test('reset doesnt set node to empty node if node is a wall node', () => {
        node.setAsWallNode();

        node.reset();

        expect(node.isWallNode()).toBe(true);
    });

    test('addEventListener adds event listener to dom element', () => {
        const fn = jest.fn();
        node.addEventListener('click', fn);

        node.element.click();

        expect(fn).toHaveBeenCalledTimes(1);
    });

    test('isWallNode returns true when node has been set as a wall node', () => {
        node.setAsWallNode();

        expect(node.isWallNode()).toBe(true);
    });

    test('isWallNode returns false when node is not set as a wall node', () => {
        node.setAsEmptyNode();

        expect(node.isWallNode()).toBe(false);
    });

    test('toggleNodeType switches node type from empty to wall', () => {
        node.setAsEmptyNode();

        node.toggleNodeType();

        expect(node.isWallNode()).toBe(true);
    });

    test('toggleNodeType switches node type from wall to empty', () => {
        node.setAsWallNode();

        node.toggleNodeType();

        expect(node.isWallNode()).toBe(false);
    });

    test('isStartNode returns true when class list is "node start"', () => {
        node.element.className = 'node start';

        expect(node.isStartNode()).toBe(true);
    });

    test('isStartNode returns false when class list does not contain start', () => {
        node.element.className = 'node';

        expect(node.isStartNode()).toBe(false);
    });

    test('isEndNode return true when class list is "node end"', () => {
        node.element.className = 'node end';

        expect(node.isEndNode()).toBe(true);
    });

    test('isEndNode returns false when class list does not contain end', () => {
        node.element.className = 'node';

        expect(node.isEndNode()).toBe(false);
    });

    describe('test node type setter methods', () => {
        beforeEach(() => {
            node.element.className = 'blah random stuff';
        });

        test('setAsStartNode sets class list to "node start"', () => {
            node.setAsStartNode();

            expect(node.element.className).toBe('node start');
        });

        test('setAsEndNode sets class list to "node end"', () => {
            node.setAsEndNode();

            expect(node.element.className).toBe('node end');
        });

        test('setAsEmptyNode sets class list to "node empty"', () => {
            node.setAsEmptyNode();

            expect(node.element.className).toBe('node empty');
        });

        test('setAsEmptyNode sets class list to "node empty" when force is true', () => {
            node.setAsStartNode();

            node.setAsEmptyNode(true);

            expect(node.element.className).toBe('node empty');
        });

        test('setAsEmptyNode doesnt change class list if node is a start node and force is false', () => {
            node.setAsStartNode();

            node.setAsEmptyNode();

            expect(node.isStartNode()).toBe(true);
        });

        test('setAsEmptyNode doesnt change class list if node is a end node and force is false', () => {
            node.setAsEndNode();

            node.setAsEmptyNode();

            expect(node.isEndNode()).toBe(true);
        });

        test('setAsWallNode sets class list to "node wall"', () => {
            node.setAsWallNode();

            expect(node.element.className).toBe('node wall');
        });

        test('setAsWallNode doesnt change class list if node is a start node', () => {
            const name = 'stuff';
            node.element.className = name;
            node.isStartNode = jest.fn().mockReturnValueOnce(true);

            node.setAsWallNode();

            expect(node.element.className).toBe(name);
        });

        test('setAsWallNode doesnt change class list if node is an end node', () => {
            const name = 'stuff';
            node.element.className = name;
            node.isEndNode = jest.fn().mockReturnValueOnce(true);

            node.setAsWallNode();

            expect(node.element.className).toBe(name);
        });

        test('setAsVisitedNode sets class list to "node visited"', () => {
            node.setAsVisitedNode();

            expect(node.element.className).toBe('node visited');
        });

        test('setAsVisitedNode doesnt change class list if node is start node', () => {
            node.setAsStartNode();

            node.setAsVisitedNode();

            expect(node.element.className).toBe('node start');
        });

        test('setAsVisitedNode doesnt change class list if node is end node', () => {
            node.setAsEndNode();

            node.setAsVisitedNode();

            expect(node.element.className).toBe('node end');
        });

        test('setAsVisitedNode sets visited property to true despite node type', () => {
            node.visited = false;
            node.element.className = 'not a valid node';

            node.setAsVisitedNode();

            expect(node.visited).toBe(true);
        });

        test('setAsVisitingNode sets class list to "node visiting"', () => {
            node.setAsVisitingNode();

            expect(node.element.className).toBe('node visiting');
        });

        test('setAsVisitingNode doesnt change class list if node is start node', () => {
            node.setAsStartNode();

            node.setAsVisitingNode();

            expect(node.element.className).toBe('node start');
        });

        test('setAsVisitingNode doesnt change class list if node is end node', () => {
            node.setAsEndNode();

            node.setAsVisitingNode();

            expect(node.element.className).toBe('node end');
        });

        test('setAsPathNode sets class list to "node path"', () => {
            node.setAsPathNode();

            expect(node.element.className).toBe('node path');
        });

        test('setAsPathNode doesnt change class list if node is start node', () => {
            node.setAsStartNode();

            node.setAsPathNode();

            expect(node.element.className).toBe('node start');
        });
    });
});
