var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.target = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.memory.target = false;
            creep.say('building');
        }

        if(creep.memory.building) {
            //console.say(Game.getObjectById(creep.memory.target).structureType)
            if(!Game.getObjectById(creep.memory.target)){
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    creep.memory.target=targets[0].id;
                }else{
                    creep.moveTo(Game.flags[Memory.rooms[creep.room.name].IdleFlag]);
                }
            }else{
                var target = Game.getObjectById(creep.memory.target);
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }else {
            var sources = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (resource) => {
                return resource.resourceType == RESOURCE_ENERGY && resource.amount >= 20;
            }});
            if(sources.length > 0){
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }else{
                var source = Game.getObjectById(Memory.rooms[creep.room.name].storage);
                if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};

module.exports = roleBuilder;