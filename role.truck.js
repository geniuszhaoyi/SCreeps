var roleTruck = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.ticksToLive < 60 && creep.carry.energy == 0){
            creep.say("retired")
            if(Game.spawns[Memory.rooms[creep.room.name].spawn_name].recycleCreep(creep)==ERR_NOT_IN_RANGE){
                creep.moveTo(Game.spawns[Memory.rooms[creep.room.name].spawn_name]);
            }
        }
        else if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (resource) => {
                    return resource.amount >= 100;}
                });
            if(sources.length > 0){
                //creep.say(sources[0].pos.x + ' ' + sources[0].pos.y+' '+sources[0].amount);
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }else{
                var source = Game.getObjectById(creep.memory.source);
                if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            /*var source = Game.getObjectById("d9ebb0bd7b3d641");
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }*/
        }else{
            var target = Game.getObjectById(creep.memory.target);
            if(target.store[RESOURCE_ENERGY] >= target.storeCapacity * 0.9){
                //target = Game.getObjectById("fbe1c0abfaebdd3");
            }
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleTruck;