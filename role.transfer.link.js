var roleTransferLink = {
    run: function (creep) {
        creep.switch();

        const factory = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: i => i.structureType === STRUCTURE_FACTORY});
        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getDroppedResource()) {
                if (!creep.getTombAll()) {
                    if (!creep.getContainerIdAll()) {
                        //工厂和市场都是不包含，存储器是包含
                        if (factory) {
                            for (let name in factory.store) {
                                if (!['Z', 'U', 'O', 'energy', 'silicon', 'utrium_bar'].includes(name)) {
                                    creep.getTargetResource(factory, name)
                                }
                            }
                        }
                        if (creep.room.terminal) {
                            for (let name in creep.room.terminal.store) {
                                if (!['zynthium_bar', 'oxidant', 'energy'].includes(name)) {
                                    creep.getTargetResource(creep.room.terminal, name)
                                }
                            }
                        }
                        if (creep.room.storage) {
                            for (let name in creep.room.storage.store) {
                                if (['Z', 'U', 'O', 'utrium_bar', 'silicon', 'zynthium_bar', 'oxidant'].includes(name)) {
                                    creep.getTargetResource(creep.room.storage, name)
                                }
                            }
                        }
                    }
                }
            }
        } else {
            if ((creep.store[RESOURCE_ENERGY] > 0 && factory && factory.store[RESOURCE_ENERGY] < 10000)) {
                creep.fillFactory()
            } else if ((creep.store[RESOURCE_ENERGY] > 0 && creep.room.terminal.store[RESOURCE_ENERGY] < 10000)) {
                creep.fillTerminal()
            } else {
                for (let name in creep.store) {
                    if (['Z', 'U', 'O', 'silicon', 'utrium_bar'].includes(name) && creep.fillFactory()) {
                    } else if (['zynthium_bar', 'oxidant'].includes(name) && creep.fillTerminal()) {
                    } else {
                        creep.fillStorage()
                    }
                }
            }
        }
    }
};

module.exports = roleTransferLink;