var roleCharger = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            /*var sources = creep.room.find(FIND_SOURCES);
            var source = undefined;
            var max_more = -10000.0;
            for(i in sources){
                var more = sources[i].energy - 10*sources[i].ticksToRegeneration;
                if(sources[i].id == creep.memory.current_source) more += 20;
                if(max_more < more){
                    max_more = more;
                    source=sources[i];
                } 
            }
            creep.memory.current_source = source.id;*/
            var source = Game.getObjectById(Memory.rooms[creep.room.name].storage);
            //creep.say(creep.withdraw(source, RESOURCE_ENERGY))
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                //creep.say('asd');
                creep.moveTo(source);
            }
        }else{
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                //creep.say("charging");
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{
                if(false){
                    
                }else{
                    creep.moveTo(Game.flags[Memory.rooms[creep.room.name].IdleFlag]);
                }
                
            }
        }
    }
};

module.exports = roleCharger;