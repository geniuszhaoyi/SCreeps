var structTerminal = {
    inital_transfer: function(source, resourceType, amount, destination, description){
        // require('structure.terminal').inital_transfer('W7N3',RESOURCE_ENERGY,100000,'W8N3','hello world')
        var truck_name = 'truck_terminal_'+source+'_'+Game.time;
        var setting = {'truck_name': truck_name, 'source': source, 'resourceType': resourceType, 'amount': amount, 'destination': destination, 'description': description};
        Memory.managers.terminal_transfer_manager.push(setting)
        return 'confirmed';
    },
    check_store: function(trs){
        if(trs.resourceType == RESOURCE_ENERGY){
            var required = trs.amount + Game.market.calcTransactionCost(trs.amount, trs.source, trs.destination);
            if(required > Game.getObjectById(Memory.rooms[trs.source].terminal).store[RESOURCE_ENERGY]) return false;
            return true;
        }else{
            var required_energy = Game.market.calcTransactionCost(trs.amount, trs.source, trs.destination);
            if(trs.amount > Game.getObjectById(Memory.rooms[trs.source].terminal).store[trs.resourceType]) return false;
            if(required_energy > Game.getObjectById(Memory.rooms[trs.source].terminal).store[RESOURCE_ENERGY]) return false;
            return true;
        }
    },
    run: function() {
        var x = _.filter(Game.creeps, (creep) => creep.memory.role == 'truck_sp' && creep.memory.work_for == 'terminal');
        for(var xi in x) {
            var creep_name = x[xi].name;
            var y = _.filter(Memory.managers.terminal_transfer_manager, (m) => m && m.truck_name == creep_name);
            if(y.length == 0){
                Game.creeps[creep_name].memory.role="recall";
            }
        }
        
        var all_null = true
        for(ti in Memory.managers.terminal_transfer_manager){
            var trs =  Memory.managers.terminal_transfer_manager[ti];
            if(!trs) continue;
            all_null = false;

            if(structTerminal.check_store(trs)){
                console.log(Game.getObjectById(Memory.rooms[trs.source].terminal).send(trs.resourceType, trs.amount, trs.destination, trs.description));
                if(Game.creeps[trs.truck_name]) Game.creeps[trs.truck_name].memory.role="recall";
                delete Memory.managers.terminal_transfer_manager[ti];
                break;
            }
            
            if(!Game.creeps[trs.truck_name]){
                var spawn_name = Memory.rooms[trs.source].spawn_name;
                var body = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE];
                var newName = Game.spawns[spawn_name].createCreep(body, trs.truck_name, {
                    role: 'truck_sp',
                    work_for: 'terminal',
                    source: Memory.rooms[trs.source].storage,
                    target: Memory.rooms[trs.source].terminal,
                    spawn: spawn_name,
                    transfer_source_type: trs.resourceType
                });
            }
        }
        if(all_null && Memory.managers.terminal_transfer_manager.length > 0){
            Memory.managers.terminal_transfer_manager = [];
        }
    }
}

module.exports = structTerminal;