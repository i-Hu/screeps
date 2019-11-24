/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */

var roleAttacker = {
    run: function (creep) {
        // 如果不在防御的房间，就前往房间
        if (creep.hits < creep.hitsMax * 0.5) {
            creep.moveTo(new RoomPosition(25, 25, 'W9N49'))
        } else {
            if (creep.room.name !== creep.memory.room) {
                creep.moveTo(new RoomPosition(25, 5, creep.memory.room))
            } else {
                if (!creep.attackClosest()) {
                    creep.moveTo(new RoomPosition(25, 5, creep.memory.room))
                }
            }
        }
    }
};

module.exports = roleAttacker;