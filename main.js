var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCharger = require('role.charger');
var roleMiner = require('role.miner');
var roleTruck = require('role.truck');
var roleMinion = require('role.minion');
var roleDefender = require('role.defender');
var roleRecall = require('role.recall');
var roleCC = require('role.colonyClaimer')

var mainRefill = require('main.refill');

var structLink = require('structure.link');
var structTower = require('structure.tower');

var stat = require('stat');

module.exports.loop = function () {
    //Game.creeps.MayFlower.claimController(Game.getObjectById("a2db077296e87b8"))
    
    structTower.run(Game.getObjectById('f0609e39ec06e0c'));
    structTower.run(Game.getObjectById('fb790d2d1460481'));
    structTower.run(Game.getObjectById('090026351478a2c'));
    
    mainRefill.refill()

    structLink.run();
    
    roleDefender.alert();
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'charger'){
            roleCharger.run(creep);
        }
        if(creep.memory.role == 'miner'){
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'truck'){
            roleTruck.run(creep);
        }
        if(creep.memory.role == 'minion'){
            roleMinion.run(creep);
        }
        if(creep.memory.role == 'defender'){
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'recall'){
            roleRecall.run(creep);
        }
        if(creep.memory.role == 'colonyClaimer'){
            roleCC.run(creep);
        }
    }
    
    stat.recording();
}