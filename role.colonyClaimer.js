var roleCC= {
    run: function(creep) {
        var controller = Game.rooms[creep.memory.room].controller;
        if(creep.reserveController(controller) == ERR_NOT_IN_RANGE){
            creep.moveTo(controller);
        }
    }
};

module.exports = roleCC;