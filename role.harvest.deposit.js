var roleHarvestDeposit = {
    run: function (creep) {
        if (creep.memory.charge && creep.store[RESOURCE_SILICON] === 0) {
            creep.memory.charge = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.charge && creep.isFull()) {
            creep.memory.charge = true;
            creep.say('charge');
        }

        if (!creep.memory.charge) {
            const droppedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: i => i.resourceType === RESOURCE_ZYNTHIUM
            });
            if (droppedResource) {
                if (creep.pickup(droppedResource) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResource, {visualizePathStyle: {stroke: '#ffaa00'}});
                }

            } else {
                const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                    filter: (i) => i.store[RESOURCE_ZYNTHIUM] > 0
                });
                if (tombstone) {
                    if (creep.withdraw(tombstone, RESOURCE_ZYNTHIUM) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    creep.harvestDeposit()
                }
            }
        } else {
            const storage = Game.rooms['W9N49'].storage;
            if (creep.transfer(storage, RESOURCE_ZYNTHIUM) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvestDeposit;