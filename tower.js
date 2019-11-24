const tower = {
    run: function () {
        // 塔修复和战斗
        for (roomName in Game.rooms) {
            Game.rooms[roomName].find(FIND_STRUCTURES, {filter: (i) => i.structureType === STRUCTURE_TOWER}).forEach(function (tower) {
                let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    tower.attack(closestHostile);
                } else {
                    let creeps = tower.room.find(FIND_MY_CREEPS, {filter: (i) => i.hits < i.hitsMax});
                    creeps.sort((a, b) => a.hits - b.hits);
                    if (creeps.length > 0) {
                        tower.heal(creeps[0]);
                    } else {
                        let structures = tower.room.find(FIND_STRUCTURES, {
                            filter: (i) => i.hits < i.hitsMax && i.hits < 250000
                        });
                        // 先修理血少的
                        structures.sort((a, b) => a.hits - b.hits);
                        if (structures.length > 0) {
                            tower.repair(structures[0]);
                        }
                    }
                }
            })
        }
    }
};
module.exports = tower;