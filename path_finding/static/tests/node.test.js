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

    test('constructor initializes dom element', () => {
        expect(node.element.className).toBe('node');
    });

    test('constructor sets dom element as child of grid', () => {
        expect(document.getElementById('grid').children).toContainEqual(node.element);
    });

    test('constructor sets node dom element id to "n${length of grid - 1}"', () => {
        expect(node.element.id).toBe(`n${grid.children.length - 1}`);
    });

    test('setAsStartNode adds .start to className', () => {
        node.setAsStartNode();

        expect(node.element.className).toContain('node start');
    });
});
