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
		if(!creep.memory.storage) storage = Game.getObjectById(Memory.rooms[creep.room.name].storage)
		var link = Game.getObjectById(creep.memory.link);
		if(!creep.memory.link) link = Game.getObjectById(Memory.rooms[creep.room.name].link)
		var terminal = Game.getObjectById(creep.memory.terminal);
		if(!creep.memory.terminal) terminal = Game.getObjectById(Memory.rooms[creep.room.name].terminal)
		
		if(roleRelay.distance(creep.pos,storage.pos) > 1 || roleRelay.distance(creep.pos,link.pos) > 1 || roleRelay.distance(creep.pos,terminal.pos) > 1){
			var dx = [1,1,1,0,0,-1,-1,-1];
			var dy = [1,0,-1,1,-1,1,0,-1];
			var target=undefined;
			for(var i=0;i<8;i+=1){
				var x=storage.pos.x+dx[i];
				var y=storage.pos.y+dy[i];
				var new_position = new RoomPosition(x,y,link.pos.roomName);
				if(roleRelay.distance(link.pos,new_position) <= 1 && roleRelay.distance(terminal.pos,new_position) <= 1){
					target = new_position;
					break;
				}
			}
			creep.moveTo(target);
		}else{
		    var min_reserved_energy = 200000;
			if(_.sum(creep.carry) < creep.carryCapacity){
			    if(link.energy >= link.energyCapacity * 0.8){
					creep.withdraw(link, RESOURCE_ENERGY);
			    }else if(terminal.store[RESOURCE_ENERGY] > 0){
			        creep.withdraw(terminal, RESOURCE_ENERGY);
			    }else if(storage.store[RESOURCE_ENERGY] >= min_reserved_energy){
			        creep.withdraw(storage, RESOURCE_ENERGY);
			    }else{
			        creep.withdraw(link, RESOURCE_ENERGY);
			    }
			}else{
				if(storage.store[RESOURCE_ENERGY] >= min_reserved_energy && link.energy < link.energyCapacity * 0.5){
					creep.transfer(link, RESOURCE_ENERGY);
				}else{
					creep.transfer(storage, RESOURCE_ENERGY);
				}
			}
		}
		
    }
};

module.exports = roleRelay;