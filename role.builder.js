/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var roleUpgrader = require('role.upgrader');


var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // 状态转换
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = [];
            // 根据拥有的房间查询对应的建设基地
            for (var roomName in Game.rooms){
                Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES).forEach(i => targets.push(i))
            }
            var target = targets[0];
            if (target) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // 如果没有建设任务,顺路维修>充能
            else {
                const brokens = creep.pos.findInRange(FIND_STRUCTURES, 3, {
                    filter: object => object.hits < object.hitsMax && object.hits < 300000
                });
                if (brokens.length > 0) {
                    if (creep.repair(brokens[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(brokens[0]);
                    }
                } else {
                    roleUpgrader.run(creep);
                }
            }
        } else {
            // 收集掉落的能量
            var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
            if (droppedResources.length > 0) {
                if (creep.pickup(droppedResources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                    filter: (i) => i.store[RESOURCE_ENERGY] > 0
                });
                if (tombstone) {
                    if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    // 最近的容器
                    const containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 200
                    });
                    let container = containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY])[0];
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
    }
};

module.exports = roleBuilder;