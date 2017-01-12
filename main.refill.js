var mainRefill = {
    
    refill: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        
        for(room_name in Memory.rooms){
            var room = Memory.rooms[room_name];
            var spawn_name = room.spawn_name;
            
            var harvesters = _.filter(Game.creeps, (creep) => creep.room == Game.spawns[spawn_name].room && creep.memory.role == 'harvester');
            var upgraders = _.filter(Game.creeps, (creep) => creep.room == Game.spawns[spawn_name].room && creep.memory.role == 'upgrader');
            var chargers = _.filter(Game.creeps, (creep) => creep.room == Game.spawns[spawn_name].room && creep.memory.role == 'charger');
            var builders = _.filter(Game.creeps, (creep) => creep.room == Game.spawns[spawn_name].room && creep.memory.role == 'builder');
            var defender = _.filter(Game.creeps, (creep) => creep.room == Game.spawns[spawn_name].room && creep.memory.role == 'defender');
            var minions = _.filter(Game.creeps, (creep) => creep.room == Game.spawns[spawn_name].room && creep.memory.role == 'minion');
            
            var req_miners = _.filter(Memory.managers.miner_manager, (m) => m.spawn == spawn_name && m.inavtive != true);
            var miners = _.filter(Game.creeps, (creep) => creep.room == Game.spawns[spawn_name].room && creep.memory.role == 'miner' && creep.ticksToLive >= 75);
            var req_trucks = _.filter(Memory.managers.truck_manager, (m) => m.spawn == spawn_name && m.inavtive != true);
            var trucks = _.filter(Game.creeps, (creep) => creep.memory.spawn == spawn_name && creep.memory.role == 'truck' && creep.ticksToLive >= 60);
            
            //Game.spawns['Spawn1'].createCreep([CLAIM,MOVE], "MayFlower")==0; return;
            if(harvesters.length < room.min_creeps_num['harvester']) {
                var newName = Game.spawns[spawn_name].createCreep([CARRY,MOVE], undefined, {role: 'harvester'});
                if(!(newName<0)) console.log(spawn_name + ", harvester, " + newName);
            }else if(miners.length <  req_miners.length){
                if(Game.spawns[spawn_name].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE])==0){
                    for(tm in Memory.managers.miner_manager) if(Memory.managers.miner_manager[tm].spawn == spawn_name && Memory.managers.miner_manager[tm].inavtive != true){
                        creep=Game.creeps[Memory.managers.miner_manager[tm].miner]
                        if(!creep || creep.ticksToLive < 75){
                            var body = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE];
                            if(Memory.managers.miner_manager[tm].body) body = Memory.managers.miner_manager[tm].body;
                            var newName = Game.spawns[spawn_name].createCreep(body, undefined, {
                                role: 'miner',
                                source: Memory.managers.miner_manager[tm].source,
                                target: Memory.managers.miner_manager[tm].target,
                                position: Memory.managers.miner_manager[tm].position
                            });
                            Memory.managers.miner_manager[tm].miner=newName;
                            if(!(newName<0)){
                                console.log(spawn_name + ", miner(" + Memory.managers.miner_manager[tm].tag + "), " + newName);
                                break;
                            }
                        }
                    }
                }
            }else if(trucks.length < req_trucks.length) {
                if(Game.spawns[spawn_name].canCreateCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE])==0){
                    for(tm in Memory.managers.truck_manager) if(Memory.managers.truck_manager[tm].spawn == spawn_name && Memory.managers.truck_manager[tm].inavtive != true){
                        creep=Game.creeps[Memory.managers.truck_manager[tm].driver]
                        if(!creep || creep.ticksToLive < 60){
                            var body = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                            if(Memory.managers.truck_manager[tm].body) body = Memory.managers.truck_manager[tm].body;
                            var newName = Game.spawns[spawn_name].createCreep(body, undefined, {
                                role: 'truck',
                                source: Memory.managers.truck_manager[tm].source,
                                target: Memory.managers.truck_manager[tm].target,
                                spawn: spawn_name
                            });
                            Memory.managers.truck_manager[tm].driver=newName;
                            if(!(newName<0)){
                                console.log(spawn_name + ", truck(" + Memory.managers.truck_manager[tm].tag + "), " + newName);
                                break;
                            }
                        }
                    }
                }
            }else if(chargers.length < room.min_creeps_num['charger']) {
                var newName = Game.spawns[spawn_name].createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'charger'});
                if(!(newName<0)) console.log(spawn_name + ", charger, " + newName);
            }else if(upgraders.length < room.min_creeps_num['upgrader']) {
                var newName = Game.spawns[spawn_name].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
                if(!(newName<0)) console.log(spawn_name + ", upgrader, " + newName);
            }else if(builders.length < room.min_creeps_num['builder']) {
                var newName = Game.spawns[spawn_name].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder', source: mainRefill.getsource()});
                if(!(newName<0)) console.log(spawn_name + ", builder, " + newName);
            }else if(minions.length < room.min_creeps_num['minion']) {
                var newName = Game.spawns[spawn_name].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'minion', source: mainRefill.getsource()});
                if(!(newName<0)) console.log(spawn_name + ", minion, " + newName);
            }else if(defender.length < 0) {
                var newName = Game.spawns[spawn_name].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,HEAL], undefined, {role: "defender"});
                if(!(newName<0)) console.log(spawn_name + ", defender, " + newName);
            }
        
        }
        /*
        var minions = _.filter(Game.creeps, (creep) => creep.room == Game.spawns['Spawn2'].room && creep.memory.role == 'minion');

        else if(minions.length < 6) {
            var newName = Game.spawns['Spawn2'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'minion', source: mainRefill.getsource()});
            if(!(newName<0)) console.log("Spawn2, minion, " + newName);
        }*/

        
    },
    
    getsource: function() {
        var x = Math.random();
        if(x > 0.5) return "26f20772347f879";
        else return "71ac0772347ffe6";
    }
}

module.exports = mainRefill;