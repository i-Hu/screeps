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
        if (!creep.memory.transfer && creep.store.getFreeCapacity() === 0) {
            creep.memory.transfer = true;
            creep.say('transfer');
        }

        if (!creep.memory.transfer) {
            // 收集掉落的能量
            var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: i => i.resourceType === RESOURCE_ENERGY
            });
            if (droppedResources.length > 0) {
                if (creep.pickup(droppedResources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                    filter: (i) => i.store[RESOURCE_ENERGY] > 0
                });
                if (tombstone) {
                    if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    // 不能跨房间寻找最近的对象
                    //直接根据Id分配容器
                    var container = Game.getObjectById(creep.memory.containerId);
                    if (container.store[RESOURCE_ENERGY] > 200) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    } else {
                        // 最近的容器
                        var containers = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                structure.store[RESOURCE_ENERGY] > 500 &&
                                structure.id !== '5dd016eda0c7494428452b41' &&
                                structure.id !== '5dd007afa0c7490b4f452522'
                        });
                        var container = containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY])[0];
                        //没有合适的容器，从储存器取
                        if (!container) {
                            container = Game.getObjectById('5dcb76bbc0f91122e2eda0e4');
                        }
                        if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
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
                        var storages = [Game.getObjectById('5dd016eda0c7494428452b41'), Game.getObjectById('5dd007afa0c7490b4f452522')];
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