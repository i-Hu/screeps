var roleTransferLink = {
    run: function (creep) {
        creep.switch();

        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getContainerIdAll()){
                creep.getStorageAll()
            }
        } else {
            if (creep.store[RESOURCE_ENERGY] > 0 && creep.room.terminal.store[RESOURCE_ENERGY] > 10000) {
                creep.fillStorage()
            } else {
                creep.fillTerminal()
            }
        }
    }
};

module.exports = roleTransferLink;