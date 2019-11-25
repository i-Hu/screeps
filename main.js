const roleHarvester = require('./role.harvester');
const roleBuilder = require('./role.builder');
const roleUpgrader = require('./role.upgrader');
const roleTransfer = require('./role.transfer');
const roleReserver = require('./role.reserver');
const roleClaimer = require('./role.claimer');
const roleAttacker = require('./role.attacker');
const roleHarvestDeposit = require('./role.harvest.deposit');
const roleHarvestMineral = require('./role.harvest.mineral');
const roleHealer = require('./role.healer');
const roleTransferLink = require('./role.transfer.link');
const roleTransferMineral = require('./role.transfer.mineral');
const tower = require('./tower');
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

    tower.run();

    //工厂生产
    Game.getObjectById('5dd96ea36852de17f62ee115').produce(RESOURCE_ZYNTHIUM_BAR);
    Game.getObjectById('5dd96ea36852de17f62ee115').produce(RESOURCE_OXIDANT);
    Game.getObjectById('5dd96ea36852de17f62ee115').produce(RESOURCE_UTRIUM_BAR);
    Game.getObjectById('5dd96ea36852de17f62ee115').produce(RESOURCE_WIRE);
    Game.getObjectById('5dd96ea36852de17f62ee115').produce(RESOURCE_LEMERGIUM_BAR);
    Game.getObjectById('5dd96ea36852de17f62ee115').produce(RESOURCE_REDUCTANT);

    //link传输
    let linkFrom = [Game.getObjectById('5dd3ea0ce1f42309fea19eaa'), Game.getObjectById('5dda10a5cb7f3c1e808c9c48')];
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
        Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'transfer1',
            {
                memory: {role: 'transferLink', roomName: 'W9N49', containerId: '5dd2a406d75e52445a1fa512'},
                directions: [TOP, RIGHT]
            });
    }
    if (_.filter(Game.creeps, (creep) => creep.memory.role === 'transferLink' && creep.memory.containerId === '5dd405370c8e7a0914169d1a').length < 1) {
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'transfer2',
            {
                memory: {role: 'transferLink', roomName: 'W6N49', containerId: '5dd405370c8e7a0914169d1a'},
                directions: [BOTTOM, RIGHT]
            });
    }
    //矿物
    if (_.filter(Game.creeps, (creep) => creep.memory.role === 'transferMineral' && creep.memory.containerId === '5dd401c990946d17d1495ee5').length < 1 && _.sum(Game.getObjectById('5dd401c990946d17d1495ee5').store) > 0) {
        Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'transferMineral' + Game.time,
            {
                memory: {role: 'transferMineral', roomName: 'W9N49', containerId: '5dd401c990946d17d1495ee5'},
                directions: [TOP, RIGHT]
            });
    }
    //矿物
    if (_.filter(Game.creeps, (creep) => creep.memory.role === 'transferMineral' && creep.memory.containerId === '5dd94b7189e95c7766a45c52').length < 1 && _.sum(Game.getObjectById('5dd94b7189e95c7766a45c52').store) > 0) {
        Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'transferMineral' + Game.time,
            {
                memory: {role: 'transferMineral', roomName: 'W6N49', containerId: '5dd94b7189e95c7766a45c52'},
                directions: [BOTTOM, RIGHT]
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
                directions: [BOTTOM, RIGHT]
            });

        }
    });


    const upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader' && creep.memory.room === 'W6N49');
    const builders2 = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder' && creep.memory.room === 'W6N49');
    console.log('W6N49: Upgraders: ' + upgraders2.length + '; Builders: ' + builders2.length);
    if (upgraders2.length < 2) {
        newName = 'Upgrader' + Game.time;
        console.log('Spawn2 Spawning new upgrader: ' + newName);
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
            {
                memory: {role: 'upgrader', room: 'W6N49'},
                directions: [BOTTOM, RIGHT]
            });
    }
    // 保持建设者数量
    if (builders2.length < 1) {
        newName = 'Builder' + Game.time;
        console.log('Spawn2 Spawning new builder: ' + newName);
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'builder', room: 'W6N49'},
                directions: [BOTTOM, RIGHT]
            });
    }

    if (upgraders.length < 1) {
        newName = 'Upgrader' + Game.time;
        console.log('Spawn1 Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
            {
                memory: {role: 'upgrader', room: 'W9N49'},
                directions: [BOTTOM, RIGHT]
            });
    }
    // 保持建设者数量
    if (builders.length < 0) {
        newName = 'Builder' + Game.time;
        console.log('Spawn1 Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'builder', room: 'W9N49'},
                directions: [BOTTOM, RIGHT]
            });
    }
    // 保持传递者数量
    let ownedContainers = [];
    transfers.forEach((i) => ownedContainers.push(i.memory.containerId));
    for (let i in Game.rooms) {
        Game.rooms[i].find(FIND_STRUCTURES, {
            //对有存储能量的容器生成transfer
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 500 &&
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
                        directions: [BOTTOM, RIGHT]
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
                        directions: [BOTTOM, RIGHT]
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
                directions: [BOTTOM, RIGHT]
            });
    }
    //防止空指针异常
    if (Game.rooms['W7N49'] && Game.rooms['W7N49'].find(FIND_HOSTILE_CREEPS).length > 0 && attackers.length < 1) {
        newName = 'Attacker' + Game.time;
        console.log('Spawning new attacker: ' + newName);
        Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE], newName,
            {
                memory: {role: 'attacker', room: 'W7N49'},
                directions: [BOTTOM, RIGHT]
            });
    }
    if (healers.length < 0) {
        newName = 'healer' + Game.time;
        console.log('Spawn1 Spawning new healer: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'healer', room: 'W8N49'},
                directions: [TOP, RIGHT]
            });
    }
    const harvestMineral = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvestMineral' &&
        creep.memory.sourceId === '5bbcb27c40062e4259e93a8c');
    if (harvestMineral.length < 1&& Game.getObjectById('5bbcb27c40062e4259e93a8c').mineralAmount >0) {
        newName = 'harvestMineral' + Game.time;
        console.log('Spawn1 Spawning new harvestMineral: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'harvestMineral', room: 'W9N49', sourceId: '5bbcb27c40062e4259e93a8c'},
                directions: [TOP, RIGHT]
            });
    }
    const harvestMineral2 = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvestMineral' &&
        creep.memory.sourceId === '5bbcb29c40062e4259e93bcd' );
    if (harvestMineral2.length < 1&& Game.getObjectById('5bbcb29c40062e4259e93bcd').mineralAmount >0) {
        newName = 'harvestMineral' + Game.time;
        console.log('Spawn2 Spawning new harvestMineral: ' + newName);
        Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'harvestMineral', room: 'W6N49', sourceId: '5bbcb29c40062e4259e93bcd'},
                directions: [TOP, RIGHT]
            });
    }
    const harvestDeposits = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvestDeposit');
    if (harvestDeposits.length < 1) {
        newName = 'harvestDeposit' + Game.time;
        console.log('Spawn1 Spawning new harvestDeposit: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {role: 'harvestDeposit', room: 'W9N49', sourceId: '5dda829b9f32a9a79a45a687'},
                directions: [TOP, RIGHT]
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
        if (creep.memory.role === 'harvestMineral') {
            roleHarvestMineral.run(creep);
        }
        if (creep.memory.role === 'healer') {
            roleHealer.run(creep)
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