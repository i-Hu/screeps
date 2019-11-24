/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvesterToContainer');
 * mod.thing == 'a thing'; // true
 */
const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        creep.switch();
        if (!creep.memory.transfer) {
            if (!creep.getDroppedResource()) {
                creep.harvestSource()
            }
        } else {
            if (!creep.repairClosest()) {
                if (!creep.fillLink()) {
                    if (!creep.fillContainer()) {
                        // 临时性的功能，在新地图，充当建造者
                        creep.buildClosest()
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;