var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var position=creep.memory.position;
        if((creep.pos.x!=position.x || creep.pos.y!=position.y) && creep.carry.energy < creep.carryCapacity){
            creep.moveTo(position.x, position.y);
        }else{
            if(creep.carry.energy < creep.carryCapacity) {
                var source=Game.getObjectById(creep.memory.source);
                creep.harvest(source);
            }else{
                var target=Game.getObjectById(creep.memory.target);
                if(creep.transfer(target, RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
            }
        }
    }
};

module.exports = roleMiner;