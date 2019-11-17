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
            var container = Game.getObjectById(creep.memory.containerId);
            if (container.store[RESOURCE_ENERGY] > 200) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                creep.getEnergy()
            }
        } else {
            // 生产>塔>存储
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var towers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_TOWER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 500
                });
                if (towers.length > 0) {
                    if (creep.transfer(towers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {

                    // 暂时只有一个storage,这么写可以
                    if (['W9N49', 'W8N49'].includes(creep.room.name)) {
                        var storages = [Game.rooms['W9N49'].storage];
                        if (creep.transfer(storages[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else {
                        var storages = [Game.rooms['W6N49'].storage];
                        storages.sort((a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
                        if (creep.transfer(storages[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
            }
        }
    }
}

module.exports = roleTransfer;