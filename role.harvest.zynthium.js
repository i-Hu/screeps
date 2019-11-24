var roleHarvestZynthium = {
    run: function (creep) {
        creep.switch();
        if (!creep.memory.transfer) {
            creep.harvestSource()
        } else {
            creep.fillContainer()
        }
    }
};

module.exports = roleHarvestZynthium;