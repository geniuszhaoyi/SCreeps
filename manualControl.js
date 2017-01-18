/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('manualControl');
 * mod.thing == 'a thing'; // true
 */
var manualControl={
    run: function() {
    // Game.spawns["Spawn2"].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,CARRY,MOVE,MOVE,WORK,WORK,CARRY,MOVE,MOVE,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'mayFlower'});
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'mayFlower') {
                creep.moveTo(Game.flags.FlagU)
            }
            if(creep.memory.role == 'mayFlower' && creep.pos.isEqualTo(Game.flags.FlagU.pos)){
                creep.memory.role = 'minion';
            }
        }
    }
}
module.exports = manualControl;