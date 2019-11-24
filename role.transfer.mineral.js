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
        creep.switch();

        if (!creep.memory.transfer) {
            //直接根据Id分配容器
            if (!creep.getDroppedResource()) {
                creep.getContainerIdAll()
            }
        } else {
            creep.fillFactory()
        }
    }
};

module.exports = roleTransferMineral;