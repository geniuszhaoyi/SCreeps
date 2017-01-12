var structLink = {
    run: function() {
        for(link in Memory.managers.link_manager){
            var linkFrom = Game.getObjectById(Memory.managers.link_manager[link].source);
            var linkTo = Game.getObjectById(Memory.managers.link_manager[link].target);
            linkFrom.transferEnergy(linkTo);
        }
    }
}

module.exports = structLink;