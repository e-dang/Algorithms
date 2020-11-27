const Node = require('../src/node');

describe('NodeTest', () => {
    let node;
    let grid;

    beforeEach(() => {
        grid = document.createElement('div');
        grid.id = 'grid';
        grid.nodeSize = '10px';
        document.body.appendChild(grid);
        node = new Node(grid);
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

        test('setAsWallNode sets class list to "node wall"', () => {
            node.setAsWallNode();

            expect(node.element.className).toBe('node wall');
        });
    });
});
