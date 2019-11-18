/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */

var roleHealer = {
    run: function (creep) {

        if (creep.hits < creep.hitsMax * 0.5) {
            creep.moveTo(new RoomPosition(25, 25, 'W9N49'))
        } else {
                    // 如果不在防御的房间，就前往房间
            if (creep.room.name !== 'W8N50') {
                creep.moveTo(new RoomPosition(30, 40, 'W8N50'))
            } else {
                const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: function (object) {
                        return object.hits < object.hitsMax;
                    }
                });
                // const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (target) {
                    if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    creep.moveTo(new RoomPosition(31, 41, 'W8N50'))
                }
            }
        }
    }
};

module.exports = roleHealer;