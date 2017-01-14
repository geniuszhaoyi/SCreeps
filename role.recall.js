var roleRecall = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.say("recalled")
        if(Game.spawns[Memory.rooms[creep.room.name].spawn_name].recycleCreep(creep)==ERR_NOT_IN_RANGE){
            creep.moveTo(Game.spawns[Memory.rooms[creep.room.name].spawn_name]);
        }
    }
};

module.exports = roleRecall;