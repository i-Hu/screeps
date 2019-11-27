var roleTransferLink = {
    run: function (creep) {
        creep.switch();

        const factory = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: i => i.structureType === STRUCTURE_FACTORY});
        const labsW9 = Game.rooms['W9N49'].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LAB}});
        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getDroppedResource()) {
                if (!creep.getTombAll()) {
                    if (!creep.getContainerIdAll()) {
                        creep.switchResource()
                    }
                }
            }
        } else {
            if ((creep.store[RESOURCE_ENERGY] > 0 && factory && factory.store[RESOURCE_ENERGY] < 10000)) {
                creep.fillFactory()
            } else if ((creep.store[RESOURCE_ENERGY] > 0 && creep.room.terminal.store[RESOURCE_ENERGY] < 30000)) {
                creep.fillTerminal()
            } else {
                creep.autoFill()
            }
        }
    }
};

module.exports = roleTransferLink;