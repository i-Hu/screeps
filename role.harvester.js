const roleHarvester = {

    run: function (creep) {
        creep.switch();
        if (!creep.memory.transfer) {
            if (!creep.getDroppedResource()) {
                creep.harvestSource()
            }
        } else {
            if (!creep.repairClosest()) {
                if (!creep.fillClosestResource(STRUCTURE_LINK,RESOURCE_ENERGY)) {
                    if (!creep.fillClosestResource(STRUCTURE_CONTAINER,"all")) {
                        // 临时性的功能，在新地图，充当建造者
                        creep.buildClosest()
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;