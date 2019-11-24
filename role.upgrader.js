/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        creep.switch();
        if (creep.memory.transfer) {
            var controller = Game.rooms[creep.memory.room].controller;
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            creep.getTargetResource(creep.room.storage,RESOURCE_ENERGY)
        }
    }
};

module.exports = roleUpgrader;