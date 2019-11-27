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
                                if (['Z', 'U', 'O', "L", 'H', "K", 'utrium_bar', 'silicon', 'zynthium_bar', 'oxidant', 'keanium_bar', 'lemergium_bar', 'reductant'].includes(name)) {
                                    creep.getTargetResource(creep.room.storage, name)
                                }
                            }
                        }
                        if (creep.room.terminal) {
                            for (let name in creep.room.terminal.store) {
                                if (!['Z', 'U', "L", "K", 'zynthium_bar', 'oxidant', 'energy', 'utrium_bar', 'lemergium_bar', 'keanium_bar', 'reductant'].includes(name) ||
                                    //终端保存1W资源供反应消耗
                                    (['Z', 'U', "L", "K"].includes(name) && creep.room.terminal.store[name] > 10000)) {
                                    creep.getTargetResource(creep.room.terminal, name)
                                }
                            }
                        }
                        if (factory) {
                            for (let name in factory.store) {
                                if (!['Z', 'U', 'O', "L", 'H', "K", 'energy', 'silicon', 'utrium_bar'].includes(name)) {
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
            } else if ((creep.store[RESOURCE_ENERGY] > 0 && creep.room.terminal.store[RESOURCE_ENERGY] < 30000)) {
                creep.fillTerminal()
            } else {
                creep.autoFill()
            }
        }
    }
};

module.exports = roleTransferLink;