var roleTransferLink = {
    run: function (creep) {
        if (creep.memory.transfer && creep.isEmpty()) {
            creep.memory.transfer = false;
            creep.say('withdraw');
        }
        if (!creep.memory.transfer && creep.isFull()) {
            creep.memory.transfer = true;
            creep.say('transfer');
        }

        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            let container = Game.getObjectById(creep.memory.containerId);
            if (container && container.store[RESOURCE_ENERGY] >= 300) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                let container = creep.room.storage;
                for (let name in container.store) {
                    if (creep.withdraw(container, name) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
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