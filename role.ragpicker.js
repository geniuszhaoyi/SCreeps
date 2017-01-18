var roleRagpicker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.ticksToLive < 60 && _.sum(creep.carry) == 0){
            creep.say("retired")
            if(Game.spawns[Memory.rooms[creep.room.name].spawn_name].recycleCreep(creep)==ERR_NOT_IN_RANGE){
                creep.moveTo(Game.spawns[Memory.rooms[creep.room.name].spawn_name]);
            }
        }
        else if(_.sum(creep.carry) < creep.carryCapacity) {
            var sources = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (resource) => {
                return (resource.resourceType == RESOURCE_ENERGY && resource.amount >= 50)||
                (resource.resourceType != RESOURCE_ENERGY && resource.amount >= 1)
            }});
            if(sources.length > 0){
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }else if(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)){
                var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                //if(target.hits <= 150 * 12 * _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER && structure.room == creep.room).length){
                    creep.moveTo(target);
                //}
            }else if(_.sum(creep.carry) > 0){
                for(rst in creep.carry){
                    if(creep.transfer(creep.room.storage, rst) == ERR_NOT_IN_RANGE){
                        creep.moveTo(creep.room.storage);
                        break;
                    }
                }
            }else{
                creep.moveTo(Game.flags[Memory.rooms[creep.room.name].IdleFlag]);
            }
        }else{
            for(rst in creep.carry){
                if(creep.transfer(creep.room.storage, rst) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.storage);
                    break;
                }
            }
        }
    }
};

module.exports = roleRagpicker;