var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var position=new RoomPosition(creep.memory.position.x, creep.memory.position.y, creep.memory.position.roomName);
        if(creep.pos.isEqualTo(position)==false && creep.carry.energy < creep.carryCapacity){
            creep.moveTo(position)
        }else{
            if(_.sum(creep.carry) < creep.carryCapacity) {
                var source=Game.getObjectById(creep.memory.source);
                creep.harvest(source);
            }else{
                var target=Game.getObjectById(creep.memory.target);
                for(c in creep.carry){
                    var RESOURCE_TYPE = c;
                    var ans = creep.transfer(target, RESOURCE_TYPE)
                    if(ans == ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                }
                
                
                
            }
        }
    }
};

module.exports = roleMiner;