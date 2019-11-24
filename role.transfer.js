/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transfer');
 * mod.thing == 'a thing'; // true
 */
var roleTransfer = {
    run: function (creep) {
        creep.switch();

        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getDroppedResource()) {
                if (!creep.getTombAll()) {
                    if (!creep.getContainerIdAll()) {
                        if (creep.room.energyAvailable < 2700) {
                            creep.getEnergy()
                        } else {
                            creep.moveTo(Game.getObjectById(creep.memory.containerId), {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }
        } else {
            // 维修>生产>塔>存储
            if (!creep.repairClosest()) {
                if (!creep.fillTower()) {
                    if (!creep.fillSpawnEnergy()) {
                        if (!creep.fillClosestResource(STRUCTURE_LINK,RESOURCE_ENERGY)) {
                            creep.fillStorage()
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleTransfer;