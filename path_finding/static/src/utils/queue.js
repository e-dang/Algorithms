class QueueNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    push(val) {
        if (this.isEmpty()) {
            this.head = new QueueNode(val);
            this.tail = this.head;
        } else {
            const node = new QueueNode(val);
            this.tail.next = node;
            this.tail = node;
        }
    }

    pop() {
        if (this.isEmpty()) {
            return undefined;
        }

        const node = this.head;
        this.head = node.next;
        if (this.head == null) {
            this.tail == null;
        }

        return node.val;
    }

    isEmpty() {
        return this.head === null;
    }
}

module.exports = Queue;
