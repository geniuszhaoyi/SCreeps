var mainRefill = {
    
    refill: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
        //var newName = Game.spawns.Spawn2.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],undefined,{role: 'truck', source: 'c9c043c069f572a', target: '19a28ed2baa8bb7'})
        //if(!(newName<0)) console.log("W7N3" + ", " + "Spawn2" + ", interroomal, " + newName);
        
        if(Memory.rooms['W7N4'] && Memory.rooms['W7N4'].inactive != true){
            var defender = _.filter(Game.creeps, (creep) => creep.room == Game.rooms['W7N4'] && creep.memory.role == 'defender');
            if(defender.length <  Memory.rooms['W7N4'].min_creeps_num['defender']) {
                var newName = Game.spawns['Spawn2'].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK,MOVE,HEAL], undefined, {role: "defender"});
                if(!(newName<0)){
                    console.log('W7N4' + ", " + 'Spawn2' + ", defender, " + newName);
                    return;
                }
            }
        }
        
        var building = {};
        
        for(room_name in Memory.rooms){
            var room = Memory.rooms[room_name];
            var spawn_name = room.spawn_name;
            
            if(!(Memory.rooms[room_name]) || Memory.rooms[room_name].inactive == true){
                continue;
            }
            if(building[spawn_name] == true){      //Avoid problems and WTFs in multithreaded
                continue;
            }
            var room_building = true;
            
            var harvesters = _.filter(Game.creeps, (creep) => creep.room == Game.rooms[room_name] && creep.memory.role == 'harvester');
            var upgraders = _.filter(Game.creeps, (creep) => creep.room == Game.rooms[room_name] && creep.memory.role == 'upgrader');
            var chargers = _.filter(Game.creeps, (creep) => creep.room == Game.rooms[room_name] && creep.memory.role == 'charger');
            var builders = _.filter(Game.creeps, (creep) => creep.room == Game.rooms[room_name] && creep.memory.role == 'builder'); // No construction, no builder
            var defender = _.filter(Game.creeps, (creep) => creep.room == Game.rooms[room_name] && creep.memory.role == 'defender');
            var minions = _.filter(Game.creeps, (creep) => creep.room == Game.rooms[room_name] && creep.memory.role == 'minion');
            var colonyClaimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'colonyClaimer' && creep.ticksToLive >= 75);
            var ragpicker = _.filter(Game.creeps, (creep) => creep.room == Game.rooms[room_name] && creep.memory.role == 'ragpicker');

            var req_miners = _.filter(Memory.managers.miner_manager, (m) => m.spawn == spawn_name && m.inactive != true);
            var miners = _.filter(Game.creeps, (creep) => creep.memory.spawn == spawn_name && creep.memory.role == 'miner' && creep.ticksToLive >= 75);
            var req_trucks = _.filter(Memory.managers.truck_manager, (m) => m.spawn == spawn_name && m.inactive != true);
            var trucks = _.filter(Game.creeps, (creep) => creep.memory.spawn == spawn_name && creep.memory.role == 'truck' && creep.ticksToLive >= 60);
            var relays = _.filter(Game.creeps, (creep) => creep.room == Game.rooms[room_name] && creep.memory.role == 'relay' && creep.ticksToLive >= 60);
			
			//if(spawn_name == 'Spawn3') console.log(req_trucks.length +' '+ trucks.length + ' ' + trucks);
            
            if(harvesters.length < room.min_creeps_num['harvester']) {
                var body = [CARRY,MOVE];
                if(Game.rooms[room_name].controller.level >=7) body = [CARRY,CARRY,MOVE];
                var newName = Game.spawns[spawn_name].createCreep(body, undefined, {role: 'harvester'});
                if(!(newName<0)) console.log(room_name + ", " + spawn_name + ", harvester, " + newName);
            }else if(miners.length < req_miners.length){
                if(Game.spawns[spawn_name].canCreateCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE])==0){
                    for(tm in Memory.managers.miner_manager) if(Memory.managers.miner_manager[tm].spawn == spawn_name && Memory.managers.miner_manager[tm].inactive != true){
                        creep=Game.creeps[Memory.managers.miner_manager[tm].miner]
                        if(!creep || creep.ticksToLive < 75){
                            var body = [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE];
                            if(Memory.managers.miner_manager[tm].body) body = Memory.managers.miner_manager[tm].body;
                            var newName = Game.spawns[spawn_name].createCreep(body, undefined, {
                                role: 'miner',
                                source: Memory.managers.miner_manager[tm].source,
                                target: Memory.managers.miner_manager[tm].target,
                                position: Memory.managers.miner_manager[tm].position,
                                spawn: Memory.managers.miner_manager[tm].spawn
                            });
                            if(!(newName<0)){
                                Memory.managers.miner_manager[tm].miner=newName;
                                console.log(room_name + ", " + spawn_name + ", miner(" + Memory.managers.miner_manager[tm].tag + "), " + newName);
                                break;
                            }
                        }
                    }
                }
            }else if(trucks.length < req_trucks.length) {
                if(Game.spawns[spawn_name].canCreateCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE])==0){
                    for(tm in Memory.managers.truck_manager) if(Memory.managers.truck_manager[tm].spawn == spawn_name && Memory.managers.truck_manager[tm].inactive != true){
                        creep=Game.creeps[Memory.managers.truck_manager[tm].driver]
                        if(!creep || creep.ticksToLive < 60){
                            var body = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                            if(Memory.managers.truck_manager[tm].body) body = Memory.managers.truck_manager[tm].body;
                            var newName = Game.spawns[spawn_name].createCreep(body, undefined, {
                                role: 'truck',
                                source: Memory.managers.truck_manager[tm].source,
                                target: Memory.managers.truck_manager[tm].target,
                                spawn: Memory.managers.truck_manager[tm].spawn,
                                transfer_source_type: Memory.managers.truck_manager[tm].transfer_source_type
                            });
                            if(!(newName<0)){
                                Memory.managers.truck_manager[tm].driver=newName;
                                console.log(room_name + ", " + spawn_name + ", truck(" + Memory.managers.truck_manager[tm].tag + "), " + newName);
                                break;
                            }
                        }
                    }
                }
            /*}else if(relays.length < req_relays.length) {
                if(Game.spawns[spawn_name].canCreateCreep([CARRY,CARRY,CARRY,CARRY,MOVE])==0){
                    for(tm in Memory.managers.relay_manager) if(Memory.managers.relay_manager[tm].spawn == spawn_name && Memory.managers.relay_manager[tm].inactive != true){
                        creep=Game.creeps[Memory.managers.relay_manager[tm].driver]
                        if(!creep || creep.ticksToLive < 60){
                            var body = [CARRY,CARRY,CARRY,CARRY,MOVE];
                            if(Memory.managers.relay_manager[tm].body) body = Memory.managers.relay_manager[tm].body;
                            var newName = Game.spawns[spawn_name].createCreep(body, undefined, {
                                role: 'relay',
                                link: Memory.managers.relay_manager[tm].link,
                                storage: Memory.managers.relay_manager[tm].storage,
                                spawn: Memory.managers.relay_manager[tm].spawn,
                                transfer_source_type: RESOURCE_ENERGY //Memory.managers.relay_manager[tm].transfer_source_type
                            });
                            if(!(newName<0)){
                                Memory.managers.relay_manager[tm].driver=newName;
                                console.log(room_name + ", " + spawn_name + ", relay(" + Memory.managers.relay_manager[tm].tag + "), " + newName);
                                break;
                            }
                        }
                    }
                }*/
            }else if(relays.length < room.min_creeps_num['relay']){
                var newName = Game.spawns[spawn_name].createCreep([CARRY,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'relay'});
                if(!(newName<0)) console.log(room_name + ", " + spawn_name + ", relay, " + newName);
            }else if(chargers.length < room.min_creeps_num['charger']) {
                var newName = Game.spawns[spawn_name].createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'charger'});
                if(!(newName<0)) console.log(room_name + ", " + spawn_name + ", charger, " + newName);
            }else if(upgraders.length < room.min_creeps_num['upgrader']) {
                var newName = Game.spawns[spawn_name].createCreep([WORK,WORK,CARRY,MOVE,WORK,WORK,CARRY,MOVE,WORK,WORK], undefined, {role: 'upgrader'});
                if(!(newName<0)) console.log(room_name + ", " + spawn_name + ", upgrader, " + newName);
            }else if(builders.length < room.min_creeps_num['builder'] && Game.rooms[room_name].find(FIND_CONSTRUCTION_SITES).length > 0) {
                var newName = Game.spawns[spawn_name].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder'});
                if(!(newName<0)) console.log(room_name + ", " + spawn_name + ", builder, " + newName);
            }else if(minions.length < room.min_creeps_num['minion']) {
                var newName = Game.spawns[spawn_name].createCreep([WORK,WORK,CARRY,MOVE,MOVE,CARRY,MOVE,MOVE], undefined, {role: 'minion'});   //, report_pos: Game.flags.FlagColony.pos
                if(!(newName<0)) console.log(room_name + ", " + spawn_name + ", minion, " + newName);
            }else if(colonyClaimer.length < room.min_creeps_num['colonyClaimer']) {
                var newName = Game.spawns[spawn_name].createCreep([CLAIM,MOVE,MOVE], undefined, {role: "colonyClaimer", room: room_name});
                if(!(newName<0)) console.log(room_name + ", " + spawn_name + ", colonyClaimer, " + newName);
            }else if(ragpicker.length < room.min_creeps_num['ragpicker']) {
                var newName = Game.spawns[spawn_name].createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,MOVE], undefined, {role: "ragpicker", room: room_name});
                if(!(newName<0)) console.log(room_name + ", " + spawn_name + ", ragpicker, " + newName);
            }else{
                room_building = false;
            }

            if(room_building==true){
                building[spawn_name] = true;
            }
        
        }
    },
    
}

module.exports = mainRefill;