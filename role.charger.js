var roleCharger = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var source = Game.getObjectById(Memory.rooms[creep.room.name].storage);
            //creep.say(creep.withdraw(source, RESOURCE_ENERGY))
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }
        }else{
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.95;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{
                creep.moveTo(Game.flags[Memory.rooms[creep.room.name].IdleFlag]);
            }
        }
    }
};

module.exports = roleCharger;