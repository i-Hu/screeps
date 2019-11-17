/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvesterToContainer');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let container;
        if (creep.memory.charge && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.charge = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.charge && creep.store.getFreeCapacity() === 0) {
            creep.memory.charge = true;
            creep.say('charge');
        }

        if (!creep.memory.charge) {
            const source = Game.getObjectById(creep.memory.sourceId);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE || ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            //通过存储器判断新房间，先进行修理,采集器只修容器
            if (!creep.room.storage) {
                const brokens = creep.pos.findInRange(FIND_STRUCTURES, 3,{
                    filter: object => object.hits < object.hitsMax && object.structureType === STRUCTURE_CONTAINER && object.id !== '5dcab1784d41cc5719500983' && object.id !== '5dd0c29c7f35a8865c3df05b'
                });
                brokens.sort((a, b) => a.hits - b.hits);
                if (brokens.length > 0) {
                    if (creep.repair(brokens[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(brokens[0]);
                    }
                } else {
                    // 只传递给最近的容器
                    container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                            // 所有能量的总容量
                            _.sum(structure.store) < 2000
                    });
                    if (container) {
                        if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    // 临时性的功能，在新地图，充当建造者
                    else {
                        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                        // 如果没有建设任务
                        if (target) {
                            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                        }
                    }
                }
            } else {
                // 只传递给最近的容器
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                        // 所有能量的总容量
                        _.sum(structure.store) < 2000
                });
                if (container) {
                    if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;