const roleHarvester = require('./role.harvester');
const roleBuilder = require('./role.builder');
const roleUpgrader = require('./role.upgrader');
const roleTransfer = require('./role.transfer');
const roleReserver = require('./role.reserver');
const roleClaimer = require('./role.claimer');
const roleAttacker = require('./role.attacker');
const roleHarvestDeposit = require('./role.harvest.deposit');
const roleHarvestZynthium = require('./role.harvest.zynthium');
const roleHarvesterPower = require('./role.harvest.power');
const roleHealer = require('./role.healer');
const roleTransferLink = require('./role.transfer.link');
const roleTransferMineral = require('./role.transfer.mineral');
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

    //link传输
    let linkFrom = [Game.getObjectById('5dd3f0315eff015433cf62b8'), Game.getObjectById('5dd3ea0ce1f42309fea19eaa')];
    let linkTo = Game.getObjectById('5dd2a406d75e52445a1fa512');
    linkFrom.forEach(i => i.transferEnergy(linkTo));

    linkFrom = [Game.getObjectById('5dd40b66a1ca0b6d2702bdbd'), Game.getObjectById('5dd7bfe2c410762922d17e7d')];
    linkTo = Game.getObjectById('5dd405370c8e7a0914169d1a');
    linkFrom.forEach(i => i.transferEnergy(linkTo));

    // 显示各兵种数量
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.memory.room === 'W9N49');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.memory.room === 'W9N49');
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const transfers = _.filter(Game.creeps, (creep) => creep.memory.role === 'transfer');
    const reservers = _.filter(Game.creeps, (creep) => creep.memory.role === 'reserver');
    const attackers = _.filter(Game.creeps, (creep) => creep.memory.role === 'attacker');
    const healers = _.filter(Game.creeps, (creep) => creep.memory.role === 'healer');
    console.log('W9N49: Harvesters: ' + harvesters.length + ';Upgraders: ' + upgraders.length + '; Builders: ' + builders.length + ';Transfers: ' + transfers.length + ';Reservers: ' + reservers.length + ';Attackers: ' + attackers.length + ";healers：" + healers.length);

    // 核心传递者
    if (_.filter(Game.creeps, (creep) => creep.memory.role === 'transferLink' && creep.memory.containerId === '5dd2a406d75e52445a1fa512').length < 1) {
        Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'transfer1',
            {
                memory: {role: 'transferLink', containerId: '5dd2a406d75e52445a1fa512'},
                directions: [TOP]
            });
    }
    if (_.filter(Game.creeps, (creep) => creep.memory.role === 'transferLink' && creep.memory.containerId === '5dd405370c8e7a0914169d1a').length < 1) {
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'transfer2',
            {
                memory: {role: 'transferLink', containerId: '5dd405370c8e7a0914169d1a'},
                directions: [BOTTOM]
            });
    }
    //矿物
    if (_.filter(Game.creeps, (creep) => creep.memory.role === 'transferMineral' && creep.memory.containerId === '5dd401c990946d17d1495ee5').length < 1) {
        Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'transferMineral1',
            {
                memory: {role: 'transferMineral', containerId: '5dd401c990946d17d1495ee5'},
                directions: [TOP]
            });
    }
    // 保持宣称者数量
    let reserveRoom = [];
    reservers.forEach((i) => reserveRoom.push(i.memory.roomName));
    ['W7N49', 'W8N49', 'W5N49'].forEach(roomName => {
        // 防止空指针报错
        if (!Game.rooms[roomName] || !Game.rooms[roomName].controller.reservation || (Game.rooms[roomName].controller.reservation['ticksToEnd'] < 4000 && !reserveRoom.includes(roomName))) {
            newName = 'Reserver' + roomName;
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
    if (builders2.length < 0) {
        newName = 'Builder' + Game.time;
        console.log('Spawn2 Spawning new builder: ' + newName);
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'builder', room: 'W6N49'},
                directions: [BOTTOM]
            });
    }

    if (upgraders.length < 1) {
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
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 200 &&
                ['W9N49', 'W8N49', 'W7N49', 'W6N49', 'W5N49'].includes(structure.room.name)
        }).forEach(function (container) {
            let spawnName;
            let body;
            if (!ownedContainers.includes(container.id)) {
                //根据是否是比较近的房间区分生产模块
                if (['W9N49', 'W8N49'].includes(Game.getObjectById(container.id).room.name)) {
                    spawnName = 'Spawn1';
                    body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
                } else {
                    spawnName = 'Spawn2';
                    body = [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
                }
                var newName = 'Transfer' + container.id;
                console.log(spawnName + 'Spawning new transfer: ' + newName);
                Game.spawns[spawnName].spawnCreep(body, newName,
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
            let body;
            if (!ownedSources.includes(source.id)) {
                //根据是否是比较近的房间区分生产模块
                if (['W9N49', 'W8N49'].includes(Game.getObjectById(source.id).room.name)) {
                    spawnName = 'Spawn1';
                    body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
                } else {
                    spawnName = 'Spawn2';
                    body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
                }
                const newName = 'Harvester' + source.id;
                console.log(spawnName + 'Spawning new harvester: ' + newName);
                Game.spawns[spawnName].spawnCreep(body, newName,
                    {
                        memory: {role: 'harvester', sourceId: source.id},
                        directions: [BOTTOM]
                    });
            }
        })
    }
    //防止空指针异常
    if (Game.rooms['W8N49'] && Game.rooms['W8N49'].find(FIND_HOSTILE_CREEPS).length > 0 && attackers.length < 1) {
        newName = 'Attacker' + Game.time;
        console.log('Spawning new attacker: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], newName,
            {
                memory: {role: 'attacker', room: 'W8N49'},
                directions: [BOTTOM]
            });
    }
    if (healers.length < 0) {
        newName = 'healer' + Game.time;
        console.log('Spawn1 Spawning new healer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'healer', room: 'W8N49'},
                directions: [TOP]
            });
    }
    const harvestZynthium = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvestZynthium');
    if (harvestZynthium.length < 1) {
        newName = 'harvestZynthium' + Game.time;
        console.log('Spawn1 Spawning new harvestZynthium: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'harvestZynthium', room: 'W9N49', sourceId: '5bbcb27c40062e4259e93a8c'},
                directions: [TOP]
            });
    }
    // const harvestDeposits = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvestDeposit');
    // if (harvestDeposits.length < 0) {
    //     newName = 'harvestDeposit' + Game.time;
    //     console.log('Spawn1 Spawning new harvestDeposit: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
    //         {
    //             memory: {role: 'harvestDeposit', room: 'W9N49',sourceId : '5dd94b670d3d43396b64b68f'},
    //             directions: [TOP]
    //         });
    // }
    // const harvestPower = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvestPower');
    // if (harvestPower.length < 0) {
    //     newName = 'harvestPower' + Game.time;
    //     console.log('Spawn1 Spawning new harvestPower: ' + newName);
    //     Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
    //         {
    //             memory: {role: 'harvestPower', room: 'W9N49'},
    //             directions: [TOP]
    //         });
    // }
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
        if (creep.memory.role === 'harvestZynthium') {
            roleHarvestZynthium.run(creep);
        }
        if (creep.memory.role === 'healer') {
            roleHealer.run(creep)
        }
        if (creep.memory.role === 'harvestPower') {
            roleHarvesterPower.run(creep)
        }
        if (creep.memory.role === 'transferLink') {
            if (creep.room.energyAvailable < 1350) {
                roleTransfer.run(creep)
            } else {
                roleTransferLink.run(creep)
            }
        }
        if (creep.memory.role === 'transferMineral') {
            roleTransferMineral.run(creep)
        }
    }
};