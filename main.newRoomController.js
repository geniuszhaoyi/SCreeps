var mainNRC = {
    run: function(creep) {
        var minions = _.filter(Game.creeps, function(creep){return creep.memory.role=='minion';});
        if(minions.length < 0){
            var newName = Game.spawns['Spawn2'].createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'minion', working: true});
        }
    }
};

module.exports = mainNRC;