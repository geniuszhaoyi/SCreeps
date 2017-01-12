var roleHarvester = {
    isStructureFree: function(structure){
        if(structure.structureType == STRUCTURE_SPAWN) return true;
        for(creep in Game.creeps){
            if(Game.creeps[creep].memory.role=='harvester' && Game.creeps[creep].memory.target==structure.id) return false;
        }
        return true;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0){
            creep.memory.target=false;
        }else if(creep.memory.target==false && creep.carry.energy == creep.carryCapacity){
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && 
                    structure.energy < structure.energyCapacity && 
                    roleHarvester.isStructureFree(structure)==true;
                }
            });
            if(targets.length > 0) {
                creep.memory.target=targets[0].id;
            }else{
                creep.moveTo(Game.flags[Memory.rooms[creep.room.name].IdleFlag]);
                return
            }
        }
        
        if(creep.memory.target==false){
            var source = Game.getObjectById(Memory.rooms[creep.room.name].harvester_source);
            // if(source.store[RESOURCE_ENERGY]==0)
            //     source = Game.getObjectById("fbe1c0abfaebdd3");
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }else{
            var target = Game.getObjectById(creep.memory.target);
            //creep.say(creep.transfer(creep.memory.target, RESOURCE_ENERGY))
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            if(target.energy == target.energyCapacity){
                creep.memory.target=false;
            }
        }
    }
};

module.exports = roleHarvester;