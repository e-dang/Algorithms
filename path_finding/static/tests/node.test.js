const Node = require('../src/node');

describe('NodeTest', () => {
    let node;
    let grid;

    beforeEach(() => {
        grid = document.createElement('div');
        grid.id = 'grid';
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

    test('setAsStartNode sets class list to "node start"', () => {
        node.element.className = 'blah random stuff';

        node.setAsStartNode();

        expect(node.element.className).toBe('node start');
    });

    test('setAsEndNode sets class list to "node end"', () => {
        node.element.className = 'blah random stuff';

        node.setAsEndNode();

        expect(node.element.className).toBe('node end');
    });

    test('setAsEmptyNode sets class list to "node empty"', () => {
        node.element.className = 'blah random stuff';

        node.setAsEmptyNode();

        expect(node.element.className).toBe('node empty');
    });
});
