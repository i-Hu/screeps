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
        let storage;
        if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.transfer = false;
            creep.say('withdraw');
        }
        if (!creep.memory.transfer && creep.isFull()) {
            creep.memory.transfer = true;
            creep.say('transfer');
        }

        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getDroppedEnergy()) {
                if (!creep.getTombEnergy()) {
                    var container = Game.getObjectById(creep.memory.containerId);
                    if (container && container.store[RESOURCE_ENERGY] >= 200) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    } else {
                        creep.getEnergy()
                    }
                }
            }
        } else {
            // 维修>生产>塔>存储
            if (!creep.repairClosest()) {
                if (!creep.fillSpawnEnergy()) {
                    if (!creep.fillTower()) {
                        if (!creep.fillLink()){
                            creep.fillStorage()
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleTransfer;