const BaseAlgorithm = require('./base_algorithm');
const Queue = require('../utils/queue');

class BidirectionalSearch extends BaseAlgorithm {
    async run(callback) {
        const startNode = this.grid.getStartNode();
        const endNode = this.grid.getEndNode();
        startNode.totalCost = 0;
        endNode.otherTotalCost = 0;
        const sOpen = new Queue();
        const eOpen = new Queue();

        sOpen.push(startNode);
        eOpen.push(endNode);

        while (!sOpen.isEmpty() && !eOpen.isEmpty()) {
            if ((await this.bfs(sOpen, 'start')) || (await this.bfs(eOpen, 'end'))) {
                break;
            }
        }

        callback(endNode.totalCost);
    }

    async bfs(queue, direction) {
        const node = queue.pop();
        await this.visit(node);

        if (node.totalCost != Infinity && node.otherTotalCost != Infinity) {
            this.buildPath(node);
            return true;
        }

        for (let i = 0; i < this.dr.length; i++) {
            const row = node.row + this.dr[i];
            const col = node.col + this.dc[i];

            if (this.grid.isInvalidSpace(row, col)) {
                continue;
            }

            const candidateNode = this.grid.getNode(row, col);
            if (direction === 'start' && candidateNode.totalCost > node.totalCost + candidateNode.cost) {
                await this.visiting(candidateNode);
                candidateNode.totalCost = node.totalCost + candidateNode.cost;
                candidateNode.prev = node;
                queue.push(candidateNode);
            } else if (direction === 'end' && candidateNode.otherTotalCost > node.otherTotalCost + candidateNode.cost) {
                await this.visiting(candidateNode);
                candidateNode.otherTotalCost = node.otherTotalCost + candidateNode.cost;
                candidateNode.otherPrev = node;
                queue.push(candidateNode);
            }
        }

        return false;
    }

    buildPath(node) {
        while (node.otherPrev != null) {
            const nextNode = node.otherPrev;
            nextNode.prev = node;
            nextNode.totalCost = node.totalCost + nextNode.cost;
            node = nextNode;
        }
    }
}

module.exports = BidirectionalSearch;
