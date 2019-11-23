/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transfer');
 * mod.thing == 'a thing'; // true
 */
var roleTransferMineral = {
    run: function (creep) {
        if (creep.memory.transfer && _.sum(creep.store) === 0) {
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
            for (let name in container.store) {
                if (creep.withdraw(container, name) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            creep.fillStorage()
        }
    }
};

module.exports = roleTransferMineral;