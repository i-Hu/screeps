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
                        if (creep.room.storage) {
                            for (let name in creep.room.storage.store) {
                                if (['Z', 'U', 'O', "L", 'H', "K", 'utrium_bar', 'silicon', 'zynthium_bar', 'oxidant', 'lemergium_bar', 'reductant'].includes(name)) {
                                    creep.getTargetResource(creep.room.storage, name)
                                }
                            }
                        }
                        if (creep.room.terminal) {
                            for (let name in creep.room.terminal.store) {
                                if (!['zynthium_bar', 'oxidant',  'utrium_bar', 'lemergium_bar', 'reductant'].includes(name)) {
                                    creep.getTargetResource(creep.room.terminal, name)
                                }
                            }
                        }
                        if (factory) {
                            for (let name in factory.store) {
                                if (!['Z', 'U', 'O', "L", 'H', "K", 'energy', 'silicon'].includes(name)) {
                                    creep.getTargetResource(factory, name)
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
                    if (['Z', 'U', 'O', "L", 'H', "K", 'silicon'].includes(name) && factory && _.sum(factory.store) < 45000 && creep.fillFactory()) {
                    } else if (['zynthium_bar', 'oxidant', 'utrium_bar', 'lemergium_bar', 'reductant'].includes(name) && creep.fillTerminal()) {
                    } else {
                        creep.fillStorage()
                    }
                }
            }
        }
    }
};

module.exports = roleTransferLink;