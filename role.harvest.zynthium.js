var roleHarvestZynthium = {
    run: function (creep) {
        creep.switch();
        if (!creep.memory.transfer) {
            if (!creep.getDroppedResource()) {
                if (!creep.getTombAll()) {
                    creep.harvestSource()
                }
            }
        } else {
            creep.fillContainer()
        }
    }
};

module.exports = roleHarvestZynthium;