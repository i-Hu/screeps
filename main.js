const roleHarvester = require('./role.harvester');
const roleBuilder = require('./role.builder');
const roleUpgrader = require('./role.upgrader');
const roleTransfer = require('./role.transfer');
const roleReserver = require('./role.reserver');
const roleClaimer = require('./role.claimer');
const roleAttacker = require('./role.attacker');
const roleHarvestDeposit = require('./role.harvest.deposit');
const mount = require('./mount');
module.exports.loop = function () {
    let roomName;
    let name;
    let newName;
// 挂载所有拓展
    mount();

    // 内存清理
    for (name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    // 显示控制器剩余能量
    let roomInfo = '';
    for (name in Game.rooms) {
        roomInfo = roomInfo + 'Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy; '
    }
    console.log(roomInfo);

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
                        filter: (i) => i.hits < i.hitsMax && i.hits < 25000
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

    // 显示各兵种数量
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.memory.room === 'W9N49');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.memory.room === 'W9N49');
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const transfers = _.filter(Game.creeps, (creep) => creep.memory.role === 'transfer');
    const reservers = _.filter(Game.creeps, (creep) => creep.memory.role === 'reserver');
    const attackers = _.filter(Game.creeps, (creep) => creep.memory.role === 'attacker');
    const harvestDeposits = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvestDeposit');
    console.log('W9N49: Harvesters: ' + harvesters.length + ';Upgraders: ' + upgraders.length + '; Builders: ' + builders.length + ';Transfers: ' + transfers.length + ';Reservers: ' + reservers.length + ';Attackers: ' + attackers.length + ';harvestDeposits:' + harvestDeposits.length);

    if (harvestDeposits.length < 3) {
        newName = 'harvestDeposit' + Game.time;
        console.log('Spawn1 Spawning new harvestDeposit: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'harvestDeposit', room: 'W9N49'},
                directions: [TOP]
            });
    }
    // // 保持宣称者数量
    let reserveRoom = [];

    reservers.forEach((i) => reserveRoom.push(i.memory.roomName));
    ['W7N49', 'W8N49', 'W5N49'].forEach(roomName => {
        // 防止空指针报错
        if (Game.rooms[roomName] && Game.rooms[roomName].controller.reservation && Game.rooms[roomName].controller.reservation['ticksToEnd'] < 4000 && !reserveRoom.includes(roomName)) {
            newName = 'Reserver' + Game.time;
            let spawnName;
            if (roomName === 'W8N49') {
                spawnName = 'Spawn1'
            } else {
                spawnName = 'Spawn2'
            }
            console.log(spawnName + ' Spawning new reserver: ' + newName);
            Game.spawns[spawnName].spawnCreep([CLAIM, CLAIM, MOVE, MOVE], newName, {
                memory: {
                    role: 'reserver',
                    roomName: roomName
                },
                directions: [BOTTOM]
            });

        }
    });


    const upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.memory.room === 'W6N49');
    const builders2 = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.memory.room === 'W6N49');
    console.log('W6N49: Upgraders: ' + upgraders2.length + '; Builders: ' + builders2.length);
    if (upgraders2.length < 1) {
        newName = 'Upgrader' + Game.time;
        console.log('Spawn2 Spawning new upgrader: ' + newName);
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
            {
                memory: {role: 'upgrader', room: 'W6N49'},
                directions: [BOTTOM]
            });
    }
    // 保持建设者数量
    if (builders2.length < 1) {
        newName = 'Builder' + Game.time;
        console.log('Spawn2 Spawning new builder: ' + newName);
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'builder', room: 'W6N49'},
                directions: [BOTTOM]
            });
    }

    if (upgraders.length < 0) {
        newName = 'Upgrader' + Game.time;
        console.log('Spawn1 Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
            {
                memory: {role: 'upgrader', room: 'W9N49'},
                directions: [BOTTOM]
            });
    }
    // 保持建设者数量
    if (builders.length < 1) {
        newName = 'Builder' + Game.time;
        console.log('Spawn1 Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'builder', room: 'W9N49'},
                directions: [BOTTOM]
            });
    }
    // 保持传递者数量
    let ownedContainers = [];
    transfers.forEach((i) => ownedContainers.push(i.memory.containerId));
    for (let i in Game.rooms) {
        Game.rooms[i].find(FIND_STRUCTURES, {
            //对有存储能量的容器生成transfer
            filter: (i) => i.structureType === STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 500 &&
                ['W9N49', 'W8N49', 'W7N49', 'W6N49', 'W5N49'].includes(i.room.name)
        }).forEach(function (container) {
            if (!ownedContainers.includes(container.id)) {
                //根据是否是比较近的房间区分生产模块
                if (['W9N49', 'W8N49'].includes(Game.getObjectById(container.id).room.name)) {
                    var spawnName = 'Spawn1';
                } else {
                    spawnName = 'Spawn2'
                }
                var newName = 'Transfer' + container.id;
                console.log(spawnName + 'Spawning new transfer: ' + newName);
                Game.spawns[spawnName].spawnCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                    {
                        memory: {role: 'transfer', containerId: container.id},
                        directions: [BOTTOM]
                    });
            }
        });
    }
    // 保持采集者数量
    let ownedSources = [];
    harvesters.forEach((i) => ownedSources.push(i.memory.sourceId));
    for (roomName in Game.rooms) {
        Game.rooms[roomName].find(FIND_SOURCES, {
            filter: i => ['W9N49', 'W8N49', 'W7N49', 'W6N49', 'W5N49'].includes(i.room.name)
        }).forEach(function (source) {
            let spawnName;
            if (!ownedSources.includes(source.id)) {
                //根据是否是比较近的房间区分生产模块
                if (['W9N49', 'W8N49'].includes(Game.getObjectById(source.id).room.name)) {
                    spawnName = 'Spawn1';
                } else {
                    spawnName = 'Spawn2';
                }
                const newName = 'Harvester' + source.id;
                console.log(spawnName + 'Spawning new harvester: ' + newName);
                Game.spawns[spawnName].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                    {
                        memory: {role: 'harvester', sourceId: source.id},
                        directions: [BOTTOM]
                    });
            }
        })
    }

    if (attackers.length < 1) {
        newName = 'Attacker' + Game.time;
        console.log('Spawning new attacker: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], newName,
            {
                memory: {role: 'attacker', room: 'W8N49'},
                directions: [BOTTOM]
            });
    }

    for (name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'transfer') {
            roleTransfer.run(creep);
        }
        if (creep.memory.role === 'reserver') {
            roleReserver.run(creep);
        }
        if (creep.memory.role === 'claimer') {
            roleClaimer.run(creep);
        }
        if (creep.memory.role === 'attacker') {
            roleAttacker.run(creep);
        }
        if (creep.memory.role === 'harvestDeposit') {
            roleHarvestDeposit.run(creep);
        }
    }
};