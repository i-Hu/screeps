/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.transfer');
 * mod.thing == 'a thing'; // true
 */

const roleTransfer = require('./role.transfer');
var roleTransferMineral = {
    run: function (creep) {
        creep.switch();
        const container = Game.getObjectById(creep.memory.containerId);
        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getDroppedResource()) {
                if (!creep.getTombAll()) {
                    if (!creep.getTargetAll(container)) {
                        creep.moveTo(container)
                    }
                }
            }
        } else {
            if (!creep.fillFactory()){
                creep.fillStorage()
            }
        }
    }
};

module.exports = roleTransferMineral;