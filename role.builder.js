/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var roleUpgrader = require('./role.upgrader');

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
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                let targets = [];
                // 根据拥有的房间查询对应的建设基地
                for (let roomName in Game.rooms) {
                    Game.rooms[roomName].find(FIND_CONSTRUCTION_SITES).forEach(i => targets.push(i))
                }
                if (targets.length > 0) {
                    if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                // 如果没有建设任务,顺路维修>充能
                else {
                    if (!creep.repairByTheWay()) {
                        roleUpgrader.run(creep);
                    }
                }
            }
        } else {
            creep.getEnergy()
        }
    }
};

module.exports = roleBuilder;