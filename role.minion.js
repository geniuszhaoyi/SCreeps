var roleMinion = {
    random_pick: function(a) {
        var i = a.length;
        var j = Math.floor(Math.random() * i);
        return a[j];
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        /*//creep.say(Game.flags.FlagColony.room)
        if(creep.room != Game.flags.FlagColony.room){
            creep.say('moving')
            creep.memory.state = MINION_STATE_IDLE
            creep.memory.target = undefined;
            creep.moveTo(Game.flags.FlagColony);
            return 
        }*/
        
        if(creep.memory.report_pos){ 
            var position = new RoomPosition(creep.memory.report_pos.x, creep.memory.report_pos.y, creep.memory.report_pos.roomName)
            if(creep.pos.isEqualTo(position)){
                creep.memory.report_pos = undefined;
            }else{
                creep.moveTo(position);
                return;
            }
        }
        
        var MINION_STATE_HARVESTING = 1;
        var MINION_STATE_WORKING= 2;
        var MINION_STATE_IDLE = undefined;
        
        if(creep.memory.state == MINION_STATE_IDLE){
            creep.memory.state=MINION_STATE_HARVESTING;
            creep.memory.target = undefined;
            creep.say('harvesting');
        }else if(creep.memory.state != MINION_STATE_HARVESTING && creep.carry.energy <= 0){
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
                var targets = []
                if(creep.memory.target == undefined && Math.random() <= 0.9){
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
                            (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
                            (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity * 0.75);
                        }
                    });
                    if(targets.length > 0){
                        creep.memory.target = roleMinion.random_pick(targets).id;
                        creep.memory.targetType="TRANSFER"
                    }
                }
                if(creep.memory.target == undefined && Math.random() <= 0.9){
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                        if(structure.structureType==STRUCTURE_WALL || structure.structureType==STRUCTURE_RAMPART)
                            return false; //structure.hits < Memory.settings.Max_Wall_hits * 0.1;
                        else 
                            //return structure.structureType != STRUCTURE_CONTROLLER && structure.id != structure.hits < structure.hitsMax * 0.5;
                            return structure.structureType != STRUCTURE_CONTROLLER && structure.hits < structure.hitsMax * 0.5;
                        }
                    });
                    targets.sort((a,b) => a.hits - b.hits);
                    
                    if(targets.length > 0) {
                        creep.memory.target = targets[0].id;
                        creep.memory.targetType="REPAIR"
                    }
                }
                if(creep.memory.target == undefined && Math.random() <= 0.9){
                    var targets2 = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets2.length > 0){
                        creep.memory.target = roleMinion.random_pick(targets2).id;
                        //creep.memory.target = "f218898043ed5fa";
                        creep.memory.targetType="CONSTRUCTION"
                    }
                }
                if(creep.memory.target == undefined && creep.room.controller.level > 0 && Math.random() <= 0.7){
                    creep.memory.target = creep.room.controller.id
                    creep.memory.targetType="CONTROLLER"
                }
                if(creep.room.controller.level > 0 && creep.room.controller.ticksToDowngrade <= 1000){  // Fail-safe
                    creep.memory.target = creep.room.controller.id
                    creep.memory.targetType="CONTROLLER"
                }
                if(creep.memory.target == undefined){
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                        }
                    });
                    if(targets.length > 0){
                        creep.memory.target = targets[0].id;
                        creep.memory.targetType="TRANSFER"; //Transfer to container
                    }
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
                    var sources = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
                    if(false && sources.length > 0){
                        creep.memory.target = sources[0].id;
                        creep.memory.targetType="WITHDRAW";
                    }else{
                        var sources = creep.room.find(FIND_SOURCES);
                        var source = roleMinion.random_pick(sources)
                        if(source != undefined){
                            creep.memory.target = source.id;
                            creep.memory.targetType="SOURCE";
                        }
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
                case "WITHDRAW":
                    ans=creep.withdraw(target, RESOURCE_ENERGY);
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
                creep.say(ans)
                creep.memory.target = undefined;
            }
        }else{
            creep.memory.state = MINION_STATE_IDLE;
        }
    }
};

module.exports = roleMinion;