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
        if (creep.hits < creep.hitsMax) {
            creep.moveTo(new RoomPosition(25, 25, 'W9N49'))
        } else {
            if (creep.room.name !== 'W8N49') {
                creep.moveTo(new RoomPosition(25, 5, 'W8N49'))
            } else {
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target) {
                    if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    creep.moveTo(new RoomPosition(25, 5, 'W8N49'))
                }
            }
        }
    }
};

module.exports = roleAttacker;