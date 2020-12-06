const Queue = require('../../src/utils/queue');

describe('TestQueue', () => {
    let queue;

    beforeEach(() => {
        queue = new Queue();
    });

    describe('test FIFO ordering', () => {
        beforeEach(() => {
            queue.push(1);
            queue.push(2);
            queue.push(3);
        });

        test('push adds node to end of the queue', () => {
            let node = queue.head;
            expect(node.val).toBe(1);

            node = node.next;
            expect(node.val).toBe(2);

            node = node.next;
            expect(node.val).toBe(3);

            node = node.next;
            expect(node).toBe(null);
        });

        test('pop removes nodes in the order they were pushed', () => {
            expect(queue.pop()).toBe(1);
            expect(queue.pop()).toBe(2);
            expect(queue.pop()).toBe(3);
        });
    });

    test('pop from an empty queue returns undefined', () => {
        expect(queue.pop()).toBe(undefined);
    });

    test('isEmpty returns true when the queue is empty', () => {
        const retVal = queue.isEmpty();

        expect(retVal).toBe(true);
    });

    test('isEmpty returns false when the queue is not empty', () => {
        queue.push(1);

        const retVal = queue.isEmpty();

        expect(retVal).toBe(false);
    });
});
