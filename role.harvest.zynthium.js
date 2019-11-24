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
            creep.fillClosestResource(STRUCTURE_CONTAINER,"all")
        }
    }
};

module.exports = roleHarvestZynthium;