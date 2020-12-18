const BaseGenerator = require('./base_generator');
const utils = require('../utils/utils');

class RandomWallMaze extends BaseGenerator {
    async generate() {
        const percentChance = 0.35;
        for (const node of this.grid.nodes) {
            if (Math.random() < percentChance) {
                await utils.sleep(utils.FAST);
                node.setAsWallNode();
            }
        }
    }
}

module.exports = RandomWallMaze;
