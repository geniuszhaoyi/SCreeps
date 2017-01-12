var roleMinion = {
    random_pick: function(a) {
        var i = a.length;
        var j = Math.floor(Math.random() * i);
        return a[j];
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        var MINION_STATE_HARVESTING = 1;
        var MINION_STATE_WORKING= 2;
        var MINION_STATE_IDLE = undefined;
        
        if(creep.memory.state != MINION_STATE_HARVESTING && creep.carry.energy <= 0){
            creep.memory.state=MINION_STATE_HARVESTING;
            creep.memory.target = undefined;
            creep.say('harvesting');
        }else if(creep.memory.state != MINION_STATE_WORKING && creep.carry.energy >= creep.carryCapacity){
            creep.memory.state=MINION_STATE_WORKING;
            creep.memory.target = undefined;
            creep.say('working');
        }
        
        if(creep.memory.state == MINION_STATE_IDLE){
        }else if(creep.memory.state == MINION_STATE_WORKING){
            if(!creep.memory.target){
                if(creep.memory.target == undefined){
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                    });
                    if(targets.length > 0){
                        creep.memory.target = targets[0].id;
                        creep.memory.targetType="TRANSFER"
                    }
                }
                if(creep.memory.target == undefined){
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                        if(structure.structureType==STRUCTURE_WALL || structure.structureType==STRUCTURE_RAMPART)
                            return false; //structure.hits < Memory.settings.Max_Wall_hits * 0.1;
                        else 
                            return structure.hits < structure.hitsMax * 0.5;
                        }
                    });
                    targets.sort((a,b) => a.hits - b.hits);
                    
                    if(targets.length > 0) {
                        creep.memory.target = targets[0].id;
                        creep.memory.targetType="REPAIR"
                    }
                }
                if(creep.memory.target == undefined){
                    var targets2 = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets2.length > 0){
                        creep.memory.target = targets2[0].id;
                        creep.memory.targetType="CONSTRUCTION"
                    }
                }
                if(creep.memory.target == undefined || creep.room.controller.ticksToDowngrade <= 3000){
                    creep.memory.target = creep.room.controller.id
                    creep.memory.targetType="CONTROLLER"
                }
            }
        }else if(creep.memory.state == MINION_STATE_HARVESTING){
            if(!creep.memory.target){
                var sources = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (resource) => {
                    return resource.amount >= 100;}
                });
                if(sources.length > 0){
                    creep.memory.target=sources[0].id;
                    creep.memory.targetType="RESOURCE";
                }else{
                    var sources = creep.room.find(FIND_SOURCES);
                    var source = roleMinion.random_pick(sources);
                    if(source != undefined){
                        creep.memory.target = source.id;
                        creep.memory.targetType="SOURCE";
                    }
                }
            }
        }

        if(creep.memory.target){
            var target = Game.getObjectById(creep.memory.target);
            var ans = 0;
            switch(creep.memory.targetType) {
                case "SOURCE":
                    ans=creep.harvest(target);
                    break;
                case "RESOURCE":
                    ans=creep.pickup(target);
                    break;
                case "TRANSFER":
                    ans=creep.transfer(target, RESOURCE_ENERGY);
                    break;
                case "CONSTRUCTION":
                    ans=creep.build(target);
                    break;
                case "CONTROLLER":
                    ans=creep.upgradeController(target);
                    break;
                case "REPAIR":
                    ans=creep.repair(target);
                    if(target.hits >= target.hitsMax) ans=ERR_FULL;
                    break;
            }
            if(ans == 0){
                
            }else if(ans==ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }else{
                //creep.say(ans)
                creep.memory.target = undefined;
            }
        }else{
            creep.memory.state = MINION_STATE_IDLE;
        }
    }
};

module.exports = roleMinion;