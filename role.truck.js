var roleTruck = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var TRANSFER_SOURCE_TYPE = RESOURCE_ENERGY;
        if(creep.memory.transfer_source_type) TRANSFER_SOURCE_TYPE = creep.memory.transfer_source_type
        
        if(creep.ticksToLive < 60 && _.sum(creep.carry) == 0){
            creep.say("retired")
            if(Game.spawns[Memory.rooms[creep.room.name].spawn_name].recycleCreep(creep)==ERR_NOT_IN_RANGE){
                creep.moveTo(Game.spawns[Memory.rooms[creep.room.name].spawn_name]);
            }
        }
        else if(_.sum(creep.carry) < creep.carryCapacity) {
            var sources = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (resource) => {
                return resource.resourceType == TRANSFER_SOURCE_TYPE && resource.amount >= 50
            }});
            if(sources.length > 0){
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }else{
                var source = Game.getObjectById(creep.memory.source);
                if(creep.withdraw(source, TRANSFER_SOURCE_TYPE) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }else{
            var target = Game.getObjectById(creep.memory.target);
            if(creep.transfer(target, TRANSFER_SOURCE_TYPE) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleTruck;