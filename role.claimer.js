/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claimer');
 * mod.thing == 'a thing'; // true
 */
var roleClaimer = {
    run: function (creep) {
        // 要占领的房间
        // 注意这一句有可能会获取不到 room 对象，下面会解释
        const room = Game.rooms[creep.memory.room];
        // 如果该房间不存在就先往房间走
        if (!room) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.room))
        } else {
            // 如果房间存在了就说明已经进入了该房间
            // 移动到房间的控制器并占领
            if (creep.claimController(room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(room.controller)
            }
        }
    }
}


module.exports = roleClaimer;