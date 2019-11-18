const roleHarvesterPower = {

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
            const storage = Game.rooms['W9N49'].storage;
            if (creep.transfer(storage, RESOURCE_POWER) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvesterPower;