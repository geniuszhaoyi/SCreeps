var util = {
	distance: function(pos1, pos2){
		if(pos1.roomName == pos2.roomName) return Math.max(Math.abs(pos1.x-pos2.x),Math.abs(pos1.y-pos2.y));
		return undefined
	},
	find_intersection: function(base, arr){
        var dx = [1,1,1,0,0,-1,-1,-1];
		var dy = [1,0,-1,1,-1,1,0,-1];
		var target=undefined;
		for(var i=0;i<8;i+=1){
			var x=base.pos.x+dx[i];
			var y=base.pos.y+dy[i];
			var new_position = new RoomPosition(x,y,link.pos.roomName);
			var j
			for(int j=0;j<arr.length;j++){
			    if(util.distance(arr[i].pos, new_position) > 1){
			        break;
			    }
			}
			if(j==arr.length){  //find it
			    return new_position;
			}
		}
    	return undefined;
    }
};

module.exports = util;