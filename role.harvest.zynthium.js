var roleHarvestZynthium = {
    run: function (creep) {
        if (creep.memory.charge && creep.store[RESOURCE_ZYNTHIUM] === 0) {
            creep.memory.charge = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.charge && creep.isFull()) {
            creep.memory.charge = true;
            creep.say('charge');
        }
        if (!creep.memory.charge) {
            creep.harvestSource()
        } else {
            creep.fillContainer()
        }
    }
};

module.exports = roleHarvestZynthium;