var structTower = {
    run: function(tower) {
        if(tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }else{
                var closestHitCreep = tower.pos.findClosestByRange(FIND_CREEPS, {
                    filter: (creep) => {
                        return creep.hits < creep.hitsMax;
                    }
                });
                if(closestHitCreep){
                    tower.heal(closestHitCreep);
                }else{
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            if(structure.structureType==STRUCTURE_WALL || structure.structureType==STRUCTURE_RAMPART)
                                return structure.hits < Memory.rooms[tower.room.name].Max_Wall_hits;
                            else 
                                return structure.hits < structure.hitsMax;
                        }
                    });
                    if(closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                }
            }
        }
    }
}

module.exports = structTower;