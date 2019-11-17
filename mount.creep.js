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
        const towers = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 500
        });
        if (towers.length > 0) {
            if (this.transfer(towers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true
        }
        return false
    },
    //填充所属房间的storage
    fillStorage() {
        if (['W9N49', 'W8N49'].includes(this.room.name)) {
            const storage = Game.rooms['W9N49'].storage;
            if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            const storage = Game.rooms['W6N49'].storage;
            if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },
    fillContainer() {
        // 只传递给最近的容器
        container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                // 所有能量的总容量
                _.sum(structure.store) < 2000
        });
        if (container) {
            if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true
        }
        return false
    },
    // 其他更多自定义拓展
    isFull() {
        if (!this._isFull) {
            this._isFull = _.sum(this.carry) === this.carryCapacity;
        }
        return this._isFull;
    },
    getEnergy() {
        // 收集掉落的能量>墓碑的能量>最近的容器>存储器
        if (!this.getDroppedEnergy()) {
            if (!this.getTombEnergy()) {
                if (!this.getContainerEnergy()) {
                    this.getStorageEnergy()
                }
            }
        }
    },
    getDroppedEnergy() {
        const droppedResources = this.room.find(FIND_DROPPED_RESOURCES, {
            filter: i => i.resourceType === RESOURCE_ENERGY
        });
        if (droppedResources.length > 0) {
            if (this.pickup(droppedResources[0]) === ERR_NOT_IN_RANGE) {
                this.moveTo(droppedResources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true
        }
        return false
    },
    getTombEnergy() {
        const tombstone = this.pos.findClosestByPath(FIND_TOMBSTONES, {
            filter: (i) => i.store[RESOURCE_ENERGY] > 0
        });
        if (tombstone) {
            if (this.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true
        }
        return false
    },
    getContainerEnergy() {
        // 能量最多的容器
        const containers = this.room.find(FIND_STRUCTURES, {
            filter: (i) => (i.structureType === STRUCTURE_CONTAINER &&
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
    harvestDeposit() {
        if (this.room.name !== 'W8N50') {
            this.moveTo(new RoomPosition(5, 42, 'W8N50'))
        } else {
            const deposit = Game.getObjectById('5dd0b9a7eb92884f376941fa');
            if (deposit) {
                if (this.harvest(deposit) === ERR_NOT_IN_RANGE || ERR_NOT_ENOUGH_RESOURCES) {
                    this.moveTo(deposit, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    },
    repairClosest() {
        const brokens = this.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: object => object.hits < object.hitsMax && object.hits < 300000 && object.id !== '5dcab1784d41cc5719500983' && object.id !== '5dd0c29c7f35a8865c3df05b'
        });
        if (brokens.length > 0) {
            if (this.repair(brokens[0]) === ERR_NOT_IN_RANGE) {
                this.moveTo(brokens[0]);
            }
            return true
        }
        return false
    },
    buildClosest() {
        let target = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (this.build(target) === ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true
        }
        return false
    }
};