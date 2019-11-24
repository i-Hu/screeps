var roleHarvestZynthium = {
    run: function (creep) {
        if (creep.memory.charge && creep.isEmpty()) {
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