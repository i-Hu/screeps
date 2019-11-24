var roleTransferLink = {
    run: function (creep) {
        creep.switch();

        const factory = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: i => i.structureType === STRUCTURE_FACTORY});
        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getDroppedResource()) {
                if (!creep.getTombAll()) {
                    if (!creep.getContainerIdAll()) {
                        if (!creep.getTargetResource(factory, RESOURCE_OXIDANT)) {
                            creep.getTargetResource(creep.room.terminal, RESOURCE_OXYGEN)
                        }
                    }
                }
            }
        } else {
            if (creep.store[RESOURCE_OXYGEN] > 0 || creep.store[RESOURCE_ENERGY] > 0) {
                creep.fillFactory()
            } else if (creep.store[RESOURCE_OXIDANT] > 0) {
                creep.fillTerminal()
            } else {
                creep.fillStorage()
            }
        }
    }
};

module.exports = roleTransferLink;