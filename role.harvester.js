/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvesterToContainer');
 * mod.thing == 'a thing'; // true
 */
const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
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
            if (!creep.repairClosest()) {
                if (!creep.fillLink()) {
                    if (!creep.fillContainer()) {
                        // 临时性的功能，在新地图，充当建造者
                        creep.buildClosest()
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;