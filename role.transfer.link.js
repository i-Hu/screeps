var roleTransferLink = {
    run: function (creep) {
        if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.transfer = false;
            creep.say('withdraw');
        }
        if (!creep.memory.transfer && creep.isFull()) {
            creep.memory.transfer = true;
            creep.say('transfer');
        }

        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            var container = Game.getObjectById(creep.memory.containerId);
            if (container && container.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            creep.fillStorage()
        }
    }
};

module.exports = roleTransferLink;