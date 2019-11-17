var roleHarvestDeposit = {
    run: function (creep) {
        if (creep.memory.charge && creep.store[RESOURCE_SILICON] === 0) {
            creep.memory.charge = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.charge && creep.isFull()) {
            creep.memory.charge = true;
            creep.say('charge');
        }

        if (!creep.memory.charge) {
            creep.harvestDeposit()
        } else {
            const storage = Game.rooms['W9N49'].storage;
            if (creep.transfer(storage, RESOURCE_SILICON) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvestDeposit;