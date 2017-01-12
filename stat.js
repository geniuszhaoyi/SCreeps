var Stat = {
    plus1: function(x){
        return (x + 1) % 10;
    },
    subtract: function(x,y){
        return (x - y + 10) % 10;
    },
    recording: function(){
        var rec = {k: Game.time, v: Game.getObjectById("fbe1c0abfaebdd3").store[RESOURCE_ENERGY]};
        if(Game.time % 200 == 0){
            if(Memory.record.storage_amount.arr.length >= 10){
                Memory.record.storage_amount.arr[Memory.record.storage_amount.at] = rec;
                Memory.record.storage_amount.at = Stat.plus1(Memory.record.storage_amount.at);
            }else{
                Memory.record.storage_amount.arr.push(rec);
                Memory.record.storage_amount.at += 1;
            }
        }
        if(Game.time % 10 == 0){
            if(Memory.record.storage_amount_s.arr.length >= 10){
                Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at] = rec;
                Memory.record.storage_amount_s.at = Stat.plus1(Memory.record.storage_amount.at);
            }else{
                Memory.record.storage_amount_s.arr.push(rec);
                Memory.record.storage_amount_s.at += 1;
            }
        }
    },
    report: function(){
        // require("stat").report();
        console.log("Store Energy: " + Game.getObjectById("fbe1c0abfaebdd3").store[RESOURCE_ENERGY]);
        console.log("Store Energy Change\t10  \t20  \t40  \t80  \t200 \t600\t1600");
        console.log("           Average:"+
            '\t'+Math.round((Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at].v-Memory.record.storage_amount_s.arr[Stat.subtract(Memory.record.storage_amount_s.at,1)].v)/10)+
            '\t'+Math.round((Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at].v-Memory.record.storage_amount_s.arr[Stat.subtract(Memory.record.storage_amount_s.at,2)].v)/20)+ 
            '\t'+Math.round((Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at].v-Memory.record.storage_amount_s.arr[Stat.subtract(Memory.record.storage_amount_s.at,4)].v)/40)+
            '\t'+Math.round((Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at].v-Memory.record.storage_amount_s.arr[Stat.subtract(Memory.record.storage_amount_s.at,8)].v)/80)+
            '\t'+Math.round((Memory.record.storage_amount.arr[Memory.record.storage_amount.at].v-Memory.record.storage_amount.arr[Stat.subtract(Memory.record.storage_amount.at,1)].v)/200)+
            '\t'+Math.round((Memory.record.storage_amount.arr[Memory.record.storage_amount.at].v-Memory.record.storage_amount.arr[Stat.subtract(Memory.record.storage_amount.at,3)].v)/600)+ 
            '\t'+Math.round((Memory.record.storage_amount.arr[Memory.record.storage_amount.at].v-Memory.record.storage_amount.arr[Stat.subtract(Memory.record.storage_amount.at,8)].v)/1600));
        console.log("             Total:"+
            '\t'+Math.round((Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at].v-Memory.record.storage_amount_s.arr[Stat.subtract(Memory.record.storage_amount_s.at,1)].v))+
            '\t'+Math.round((Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at].v-Memory.record.storage_amount_s.arr[Stat.subtract(Memory.record.storage_amount_s.at,2)].v))+ 
            '\t'+Math.round((Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at].v-Memory.record.storage_amount_s.arr[Stat.subtract(Memory.record.storage_amount_s.at,4)].v))+
            '\t'+Math.round((Memory.record.storage_amount_s.arr[Memory.record.storage_amount_s.at].v-Memory.record.storage_amount_s.arr[Stat.subtract(Memory.record.storage_amount_s.at,8)].v))+
            '\t'+Math.round((Memory.record.storage_amount.arr[Memory.record.storage_amount.at].v-Memory.record.storage_amount.arr[Stat.subtract(Memory.record.storage_amount.at,1)].v))+
            '\t'+Math.round((Memory.record.storage_amount.arr[Memory.record.storage_amount.at].v-Memory.record.storage_amount.arr[Stat.subtract(Memory.record.storage_amount.at,3)].v))+ 
            '\t'+Math.round((Memory.record.storage_amount.arr[Memory.record.storage_amount.at].v-Memory.record.storage_amount.arr[Stat.subtract(Memory.record.storage_amount.at,8)].v)));
        console.log(" ");
        console.log("# creeps: "+_.filter(Game.creeps).length);
        console.log(" ");
        Stat.printCreepsNum();
        //console.log(" ");
        //Stat.printMineSource();
    },
    printCreepsNum: function() {
        // require("stat").printCreepsNum();
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var chargers = _.filter(Game.creeps, (creep) => creep.memory.role == 'charger');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var trucks = _.filter(Game.creeps, (creep) => creep.memory.role == 'truck');
        console.log("# miner: " + miners.length + '/2');
        console.log("# harvesters: " + harvesters.length + '/' + Memory.settings.min_creeps_num.min_harvester);
        console.log("# chargers: " + chargers.length + '/' + Memory.settings.min_creeps_num.min_charger);
        console.log("# upgraders: " + upgraders.length + '/' + Memory.settings.min_creeps_num.min_upgrader);
        console.log("# builders: " + builders.length + '/' + Memory.settings.min_creeps_num.min_builder);
        console.log("# trucks: " + trucks.length + '/' + Memory.managers.truck_manager.length);
    },
    printMineSource: function(){
        // require("stat").printMineSource();
        var lefts = _.filter(Game.creeps, (creep) => creep.memory.source == '26f20772347f879');
        var rights = _.filter(Game.creeps, (creep) => creep.memory.source == '71ac0772347ffe6');
        console.log("# lefts: " + lefts.length);
        console.log("# rights: " + rights.length);
    },
    resetAllSourceHalfHalf: function(){
        // require("stat").resetAllSourceHalfHalf();
        var left="26f20772347f879";
        var right="71ac0772347ffe6";
        var creeps = _.filter(Game.creeps);
        console.log("# creeps: "+creeps.length);
        for (var i=0;i<creeps.length/2;i++){
            creeps[i].memory.source=left;
        }
        for (var i=Math.floor(creeps.length/2);i<creeps.length;i++){
            creeps[i].memory.source=right;
        }
        Stat.printMineSource();
    }
}

module.exports = Stat;