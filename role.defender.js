var roleDefender= {

    /** @param {Creep} creep **/
    run: function(creep) {
        var goal = false;
        if(!goal){
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                goal = true;
            }
        }
        if(!goal){
            if(creep.hits < creep.hitsMax){
                creep.heal(creep);
                goal=true;
            }
        }
        if(!goal){
            var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
                }
            });
            if(target) {
                if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                goal=true;
            }
        }
        if(!goal){
            creep.moveTo(Game.flags.FlagNR);
        }
    }
};

module.exports = roleDefender;