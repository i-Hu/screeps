var roleHarvestDeposit = {
    run: function (creep) {
        creep.switch();

        if (!creep.memory.transfer) {
            if (!creep.getDroppedResource()) {
                if (!creep.getTombAll()) {
                    if (creep.room.name !== 'W7N50') {
                        creep.moveTo(new RoomPosition(25, 35, 'W7N50'))
                    } else {
                        creep.harvestSource()
                    }
                }
            }
        } else {
            const storage = Game.rooms['W9N49'].storage;
            if (creep.transfer(storage, RESOURCE_SILICON) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvestDeposit;