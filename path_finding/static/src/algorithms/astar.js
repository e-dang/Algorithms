const BaseAlgorithm = require('./base_algorithm');
const NodeMinHeap = require('../utils/node_min_heap');

class AStarSearch extends BaseAlgorithm {
    constructor(grid, moves, heuristic) {
        super(grid, moves);
        this.heuristic = heuristic;
    }

    async run(callback) {
        const endNode = this.grid.getEndNode();
        const startNode = this.grid.getStartNode();
        const heap = new NodeMinHeap('heuristicScore');
        startNode.totalCost = 0;
        startNode.heuristicScore = this.heuristic(startNode, endNode);
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
                const cost = node.totalCost + candidateNode.weight;
                if (candidateNode.totalCost > cost) {
                    const astarScore = cost + this.heuristic(candidateNode, endNode);
                    if (heap.contains(candidateNode)) {
                        heap.update(candidateNode, astarScore);
                    } else {
                        candidateNode.heuristicScore = astarScore;
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
}

module.exports = AStarSearch;
