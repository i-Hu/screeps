// 将拓展签入 Creep 原型
module.exports = function () {
    _.assign(Creep.prototype, creepExtension)
};

// 自定义的 Creep 的拓展
const creepExtension = {
    // 自定义敌人检测
    isEnemy() {
        return this.room.find(FIND_HOSTILE_CREEPS).length > 0
    },
    // 填充所有 spawn 和 extension
    fillSpawnEnergy() {
        var target = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (target) {
            if (this.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true
        }
        return false
    },
    // 填充所有 tower
    fillTower() {
        const tower = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 500
        });
        if (tower) {
            if (this.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true
        }
        return false
    },
    //填充所属房间的storage
    fillStorage() {
        let storage;
        if (['W9N49', 'W8N49'].includes(this.room.name)) {
            storage = Game.rooms['W9N49'].storage;

        } else {
            storage = Game.rooms['W6N49'].storage;
        }
        for (let name in this.store) {
            if (this.transfer(storage, name) === ERR_NOT_IN_RANGE) {
                this.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },
    //填充所属房间的terminal
    fillTerminal() {
        let terminal;
        if (['W9N49', 'W8N49'].includes(this.room.name)) {
            terminal = Game.rooms['W9N49'].terminal;

        } else {
            terminal = Game.rooms['W6N49'].terminal;
        }
        for (let name in this.store) {
            if (this.transfer(terminal, name) === ERR_NOT_IN_RANGE) {
                this.moveTo(terminal, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },
    fillContainer() {
        // 只传递给最近的容器
        const containers = this.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                // 所有资源的总容量
                _.sum(structure.store) < 2000
        });
        if (containers.length > 0) {
            for (let name in this.store) {
                if (this.transfer(containers[0], name) === ERR_NOT_IN_RANGE) {
                    this.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            return true
        }
        return false
    },
    fillLink() {
        // 只传递给最近的LINK
        const links = this.pos.findInRange(FIND_STRUCTURES, 5, {
            filter: (i) => i.structureType === STRUCTURE_LINK &&
                // 所有能量的总容量
                _.sum(i.store) < 750
        });
        if (links.length > 0) {
            if (this.transfer(links[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(links[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true
        }
        return false
    },
    // 其他更多自定义拓展
    isFull() {
        return this.store.getFreeCapacity() === 0;
    },
    isEmpty() {
        return _.sum(this.store) === 0;
    },
    getEnergy() {
        // 收集掉落的能量>墓碑的能量>最近的容器>存储器
        if (!this.getDroppedResource()) {
            if (!this.getTombAll()) {
                if (!this.getContainerAndLinkEnergy()) {
                    this.getStorageEnergy()

                }
            }
        }
    },
    getDroppedResource() {
        const droppedResources = this.pos.findInRange(FIND_DROPPED_RESOURCES, 3);
        if (droppedResources.length > 0) {
            if (this.pickup(droppedResources[0]) === ERR_NOT_IN_RANGE) {
                this.moveTo(droppedResources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true
        }
        return false
    },
    getTombAll() {
        const tombstones = this.pos.findInRange(FIND_TOMBSTONES, 3);
        if (tombstones.length > 0) {
            for (let name in container.store) {
                if (this.withdraw(tombstones[0], name) === ERR_NOT_IN_RANGE) {
                    this.moveTo(tombstones[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            return true
        }
        return false
    },
    getContainerAndLinkEnergy() {
        // 能量最多的容器
        const containers = this.room.find(FIND_STRUCTURES, {
            filter: (i) => ((i.structureType === STRUCTURE_CONTAINER || i.structureType === STRUCTURE_LINK) &&
                i.store[RESOURCE_ENERGY] > 500)
        });
        if (containers.length > 0) {
            containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);
            if (this.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true
        }
        return false
    },
    getStorageEnergy() {
        const storage = this.room.storage;
        if (storage) {
            if (this.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true
        }
        return false
    },
    getContainerIdAll() {
        const container = Game.getObjectById(this.memory.containerId);
        if (container && _.sum(container.store) >= 200) {
            for (let name in container.store) {
                if (this.withdraw(container, name) === ERR_NOT_IN_RANGE) {
                    this.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            return true
        }
        return false
    },
    getStorageAll() {
        let storage = this.room.storage;
        if (storage) {
            for (let name in storage.store) {
                if (this.withdraw(storage, name) === ERR_NOT_IN_RANGE) {
                    this.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            return true
        }
        return false
    },
    repairClosest
        () {
        const towers = this.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType === STRUCTURE_TOWER});
        if (towers.length > 0) {
            return false
        }
        const brokens = this.pos.findInRange(FIND_STRUCTURES, 3, {
            // 容器的生命上限
            filter: object => object.hits < object.hitsMax && object.hits < 250000
        });
        if (brokens.length > 0) {
            const result = this.repair(brokens[0]);
            if (result === ERR_NOT_IN_RANGE) {
                this.moveTo(brokens[0]);
                return true
            } else if (result === OK) {
                return true
            }
        }
        return false
    }
    ,
    buildClosest() {
        const target = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (this.build(target) === ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true
        }
        return false
    }
    ,
    harvestSource() {
        const source = Game.getObjectById(this.memory.sourceId);
        if (this.harvest(source) === ERR_NOT_IN_RANGE || this.harvest(source) === ERR_NOT_ENOUGH_RESOURCES) {
            this.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    ,
    attackClosest() {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true
        }
        return false
    }
    ,
    switch() {
        if
        (this.memory.transfer && this.isEmpty()) {
            this.memory.transfer = false
        }
        if (!this.memory.transfer && this.isFull()) {
            this.memory.transfer = true
        }
    }
};
