const BaseGenerator = require('./base_generator');
const utils = require('../utils/utils');

class RandomizedDFS extends BaseGenerator {
    async generate() {
        this.grid.nodes.forEach((node) => node.setAsWallNode(false));
        await this.generateHelper(this.grid.getStartNode());
        this.grid.nodes.forEach((node) => (node.visited = false));
    }

    async generateHelper(node) {
        node.visited = true;
        while (true) {
            const neighbors = this.getNeighbors(node, (node) => !node.visited);

            if (neighbors.length === 0) {
                break;
            }

            const neighbor = utils.getRandom(neighbors);
            await this.connect(node, neighbor);
            await this.generateHelper(neighbor);
        }
    }
}

module.exports = RandomizedDFS;
