var roleDefender= {
    alert: function(){
        if(Memory.rooms['W7N4'] && Memory.rooms['W7N4'].inactive != true){
            var target = Game.flags.FlagColony.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if(target){
                Memory.rooms.W7N4.min_creeps_num.defender = 1;
            }else{
                Memory.rooms.W7N4.min_creeps_num.defender = 0;
            }
        }
    },
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
                if(creep.heal(creep) == ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
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
            var ans = creep.moveTo(Game.flags.FlagColony);
            if(ans != OK) creep.say(ans);
        }
    }
};

module.exports = roleDefender;