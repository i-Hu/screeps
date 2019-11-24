var roleTransferLink = {
    run: function (creep) {
        creep.switch();

        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getDroppedResource()) {
                if (!creep.getTombAll()) {
                    if (!creep.getContainerIdAll()) {
                        creep.getTerminalAll()
                    }
                }
            }
        } else {
            if (creep.store[RESOURCE_ZYNTHIUM] > 0) {
                creep.fillFactory()
            } else {
                creep.fillStorage()
            }
        }
    }
};

module.exports = roleTransferLink;