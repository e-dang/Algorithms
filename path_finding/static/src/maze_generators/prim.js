const BaseGenerator = require('./base_generator');
const utils = require('../utils/utils');

class RandomizedPrims extends BaseGenerator {
    async generate() {
        this.grid.nodes.forEach((node) => node.setAsWallNode(false));
        const isWallNode = (node) => node.isWallNode();
        const isPassageNode = (node) => !node.isWallNode();

        const walls = this.getNeighbors(this.grid.getStartNode(), isWallNode);
        while (walls.length) {
            const wall = utils.getRandom(walls);
            if (wall.isWallNode()) {
                const passages = this.getNeighbors(wall, isPassageNode);
                const passage = utils.getRandom(passages);
                await this.connect(passage, wall);

                this.getNeighbors(wall, isWallNode).forEach((node) => walls.push(node));
            }

            walls.splice(walls.indexOf(wall), 1);
        }
    }
}

module.exports = RandomizedPrims;
