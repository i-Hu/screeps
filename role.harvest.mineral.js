var roleHarvestMineral = {
    run: function (creep) {
        creep.switch();
        if (!creep.memory.transfer) {
            creep.harvestSource()
        } else {
            if(!creep.fillClosestResource(STRUCTURE_CONTAINER, "all")){
                creep.fillStorage()
            }
        }
    }
};

module.exports = roleHarvestMineral;