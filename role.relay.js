var roleRelay= {
	distance: function(pos1, pos2){
		if(pos1.roomName == pos2.roomName) return Math.max(Math.abs(pos1.x-pos2.x),Math.abs(pos1.y-pos2.y));
		return undefined
	},
    /** @param {Creep} creep **/
    run: function(creep) {
        var TRANSFER_SOURCE_TYPE = RESOURCE_ENERGY;
        if(creep.memory.transfer_source_type) TRANSFER_SOURCE_TYPE = creep.memory.transfer_source_type
		
		var storage = Game.getObjectById(creep.memory.storage);
		var link = Game.getObjectById(creep.memory.link);
		
		if(roleRelay.distance(creep.pos,storage.pos) > 1 || roleRelay.distance(creep.pos,link.pos) > 1){
			var dx = [1,1,1,0,0,-1,-1,-1];
			var dy = [1,0,-1,1,-1,1,0,-1];
			var target=undefined;
			for(var i=0;i<8;i+=1){
				var x=storage.pos.x+dx[i];
				var y=storage.pos.y+dy[i];
				if(roleRelay.distance(link.pos,new RoomPosition(x,y,link.pos.roomName)) <= 1){
					target = new RoomPosition(x,y,link.pos.roomName);
					break;
				}
			}
			creep.moveTo(target);
		}else{
			if(_.sum(creep.carry) < creep.carryCapacity){
				if(link.energy >= link.energyCapacity * 0.94){
					creep.withdraw(link, RESOURCE_ENERGY);
				}else{
					creep.withdraw(storage, RESOURCE_ENERGY);
				}
			}else{
				if(link.energy < link.energyCapacity * 0.82){
					creep.transfer(link, RESOURCE_ENERGY);
				}else{
					creep.transfer(storage, RESOURCE_ENERGY);
				}
			}
		}
		
		/*
        if(creep.ticksToLive < 60 && _.sum(creep.carry) == 0){
            creep.say("retired")
            if(Game.spawns[Memory.rooms[creep.room.name].spawn_name].recycleCreep(creep)==ERR_NOT_IN_RANGE){
                creep.moveTo(Game.spawns[Memory.rooms[creep.room.name].spawn_name]);
            }
        }
        else if(_.sum(creep.carry) < creep.carryCapacity) {
            var sources = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (resource) => {
                return resource.resourceType == TRANSFER_SOURCE_TYPE && resource.amount >= 50
            }});
            if(sources.length > 0){
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }else{
                var source = Game.getObjectById(creep.memory.source);
                if(creep.withdraw(source, TRANSFER_SOURCE_TYPE) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }else{
            var target = Game.getObjectById(creep.memory.target);
            if(target.structureType == STRUCTURE_LINK && target.energy < target.energyCapacity * 0.5){
                creep.moveTo(target);
            }
            if(creep.transfer(target, TRANSFER_SOURCE_TYPE) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }*/
    }
};

module.exports = roleRelay;