const BaseAlgorithm = require('./base_algorithm');
const NodeMinHeap = require('../utils/node_min_heap');

class AStarSearch extends BaseAlgorithm {
    async run(callback) {
        const endNode = this.grid.getEndNode();
        const startNode = this.grid.getStartNode();
        const heap = new NodeMinHeap('astarScore');
        startNode.totalCost = 0;
        startNode.astarScore = this.calcHeuristic(startNode, endNode);
        heap.insert(startNode);

        while (!heap.isEmpty()) {
            const node = heap.pop();
            await this.visit(node);

            if (node.isEndNode()) {
                break;
            }

            for (let i = 0; i < this.dr.length; i++) {
                const row = node.row + this.dr[i];
                const col = node.col + this.dc[i];

                if (this.grid.isInvalidSpace(row, col)) {
                    continue;
                }

                const candidateNode = this.grid.getNode(row, col);
                const cost = node.totalCost + candidateNode.cost;
                if (candidateNode.totalCost > cost) {
                    const astarScore = cost + this.calcHeuristic(candidateNode, endNode);
                    if (heap.contains(candidateNode)) {
                        heap.update(candidateNode, astarScore);
                    } else {
                        candidateNode.astarScore = astarScore;
                        heap.insert(candidateNode);
                        await this.visiting(candidateNode);
                    }

                    candidateNode.totalCost = cost;
                    candidateNode.prev = node;
                }
            }
        }

        callback(endNode.totalCost);
    }

    calcHeuristic(node1, node2) {
        return Math.sqrt(Math.pow(node1.row - node2.row, 2) + Math.pow(node1.col - node2.col, 2));
    }
}

module.exports = AStarSearch;
