const {Node, MAX_WEIGHT, MIN_WEIGHT} = require('../src/node');

describe('NodeTest', () => {
    let row;
    let col;
    let idx;
    let node;
    let gridRow;

    beforeEach(() => {
        row = 3;
        col = 1;
        idx = 4;
        gridRow = document.createElement('tr');
        gridRow.id = 'gridRow';
        document.body.appendChild(gridRow);
        node = new Node(row, col, idx, gridRow);
    });

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = '';
    });

    test('constructor initializes dom element to be an empty node', () => {
        expect(node.element.className).toBe('node empty');
    });

    test('constructor sets dom element as child of gridRow', () => {
        expect(document.getElementById('gridRow').children).toContainEqual(node.element);
    });

    test('constructor sets node dom element id to "n${idx}"', () => {
        expect(node.element.id).toBe(`n${idx}`);
    });

    test('constructor sets weight prop to default 1', () => {
        expect(node.weight).toBe(1);
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

        node = new Node(row, col, idx, gridRow);

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

    test('reset sets node to empty node if node is a visited node with empty weight', () => {
        node.setAsVisitedNode();

        node.reset();

        expect(node.element.classList.contains('empty')).toBe(true);
    });

    test('reset sets node to empty node if node is a visiting node with empty weight', () => {
        node.setAsVisitingNode();

        node.reset();

        expect(node.element.classList.contains('empty')).toBe(true);
    });

    test('reset sets node to empty node if node is a path node with empty weight', () => {
        node.setAsPathNode();

        node.reset();

        expect(node.element.classList.contains('empty')).toBe(true);
    });

    test('reset sets node to weight node if node is a visited node with weight', () => {
        node.setAsVisitedNode();
        node.weight = MIN_WEIGHT;

        node.reset();

        expect(node.element.classList.contains('weight')).toBe(true);
    });

    test('reset sets node to weight node if node is a visiting node with weight', () => {
        node.setAsVisitingNode();
        node.weight = MIN_WEIGHT;

        node.reset();

        expect(node.element.classList.contains('weight')).toBe(true);
    });

    test('reset sets node to weight node if node is a path node with weight', () => {
        node.setAsPathNode();
        node.weight = MIN_WEIGHT;

        node.reset();

        expect(node.element.classList.contains('weight')).toBe(true);
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

    test('reset doesnt set node to empty node if node is a weight node', () => {
        node.setAsWeightNode(MIN_WEIGHT);

        node.reset();

        expect(node.isWeightNode()).toBe(true);
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

    test('isWeightNode returns true when node class list contains "weight"', () => {
        node.element.classList = 'node weight';

        expect(node.isWeightNode()).toBe(true);
    });

    test('isWeightNode returns false when node class list doesnt contains "weight"', () => {
        node.element.classList = 'node weightasdasd';

        expect(node.isWeightNode()).toBe(false);
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

    test('resetWeight sets the weight to 1', () => {
        node.weight = 12;

        node.resetWeight();

        expect(node.weight).toBe(1);
    });

    test('resetWeight sets element opacity to 1', () => {
        node.element.style.opacity = 0.5;

        node.resetWeight();

        expect(node.element.style.opacity).toBe('1');
    });

    test('_calcOpacity returns 0.25 when weight is MIN_WEIGHT', () => {
        node.weight = MIN_WEIGHT;

        const retVal = node._calcOpacity();

        expect(retVal).toBeCloseTo(0.25, 2);
    });

    test('_calcOpacity returns 0.75 when weight is MAX_WEIGHT', () => {
        node.weight = MAX_WEIGHT;

        const retVal = node._calcOpacity();

        expect(retVal).toBeCloseTo(0.75, 2);
    });

    test('_calcInvertedOpacity returns 0.75 when weight is MIN_WEIGHT', () => {
        node.weight = MIN_WEIGHT;

        const retVal = node._calcInvertedOpacity();

        expect(retVal).toBeCloseTo(0.75, 2);
    });

    test('_calcInvertedOpacity returns 0.25 when weight is MAX_WEIGHT', () => {
        node.weight = MAX_WEIGHT;

        const retVal = node._calcInvertedOpacity();

        expect(retVal).toBeCloseTo(0.25, 2);
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

        test('setAsEmptyNode sets class list to "node animatedEmpty empty" when animation is true', () => {
            node.setAsEmptyNode(false, true);

            expect(node.element.className).toBe('node animatedEmpty empty');
        });

        test('setAsEmptyNode sets class list to "node animatedEmpty empty" when force is true and animation is true', () => {
            node.setAsStartNode();

            node.setAsEmptyNode(true);

            expect(node.element.className).toBe('node animatedEmpty empty');
        });

        test('setAsEmptyNode sets class list to "node empty" when animation is false', () => {
            node.setAsEmptyNode(false, false);

            expect(node.element.className).toBe('node empty');
        });

        test('setAsEmptyNode sets class list to "node empty" when force is true and animation is false', () => {
            node.setAsStartNode();

            node.setAsEmptyNode(true, false);

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

        test('setAsWallNode sets class list to "node wall" when animation is false', () => {
            node.setAsWallNode(false);

            expect(node.element.className).toBe('node wall');
        });

        test('setAsWallNode sets class list to "node animatedWall wall" when animation is true', () => {
            node.setAsWallNode(true);

            expect(node.element.className).toBe('node animatedWall wall');
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

        test('setAsWeightNode sets class list to node "node weight" when animation is false', () => {
            node.setAsWeightNode(MIN_WEIGHT, false);

            expect(node.element.className).toBe('node weight');
        });

        test('setAsWeightNode sets class list to node "node animatedWeight weight" when animation is true', () => {
            node.setAsWeightNode(MIN_WEIGHT, true);

            expect(node.element.className).toBe('node animatedWeight weight');
        });

        test('setAsWeightNode sets weight prop to weight param', () => {
            const weight = MAX_WEIGHT - 1;

            node.setAsWeightNode(weight);

            expect(node.weight).toBe(weight);
        });

        test('setAsWeightNode doesnt set weight prop to weight param if weight is greater than MAX_WEIGHT', () => {
            const weight = MAX_WEIGHT + 1;

            node.setAsWeightNode(weight);

            expect(node.weight).not.toBe(weight);
        });

        test('setAsWeightNode doesnt set weight prop to weight param if weight is less than MIN_WEIGHT', () => {
            const weight = 0;

            node.setAsWeightNode(weight);

            expect(node.weight).not.toBe(weight);
        });

        test('setAsWeightNode sets opacity of element to the return value of _calcOpacity', () => {
            const weight = MAX_WEIGHT - 5;
            const retVal = '100';
            node._calcOpacity = jest.fn().mockReturnValueOnce(retVal);

            node.setAsWeightNode(weight);

            expect(node.element.style.opacity).toBe(retVal);
        });

        test('setAsWeightNode doesnt change class list if node is a start node', () => {
            const name = 'stuff';
            node.element.className = name;
            node.isStartNode = jest.fn().mockReturnValueOnce(true);

            node.setAsWeightNode();

            expect(node.element.className).toBe(name);
        });

        test('setAsWeightNode doesnt change class list if node is an end node', () => {
            const name = 'stuff';
            node.element.className = name;
            node.isEndNode = jest.fn().mockReturnValueOnce(true);

            node.setAsWeightNode();

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

        test('setAsVisitingNode sets opacity to retVal of _calcInvertedOpacity if node is a weight node', () => {
            const retVal = '100';
            node.isWeightNode = jest.fn().mockReturnValueOnce(true);
            node._calcInvertedOpacity = jest.fn().mockReturnValueOnce(retVal);

            node.setAsVisitingNode();

            expect(node.element.style.opacity).toBe(retVal);
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

        test('setAsStartNode calls resetWeight', () => {
            node.resetWeight = jest.fn();

            node.setAsStartNode();

            expect(node.resetWeight).toHaveBeenCalledTimes(1);
        });

        test('setAsEndNode calls resetWeight', () => {
            node.resetWeight = jest.fn();

            node.setAsEndNode();

            expect(node.resetWeight).toHaveBeenCalledTimes(1);
        });

        test('setAsWallNode calls resetWeight', () => {
            node.resetWeight = jest.fn();

            node.setAsWallNode();

            expect(node.resetWeight).toHaveBeenCalledTimes(1);
        });

        test('setAsEmptyNode calls resetWeight', () => {
            node.resetWeight = jest.fn();

            node.setAsEmptyNode();

            expect(node.resetWeight).toHaveBeenCalledTimes(1);
        });
    });
});
