Template.main.uid = function () {
  return Session.get('user_id');
};

// Template.main.events({
//   'keydown body' : function (event) {
//     alert('hi');
//     console.log(event);
//   }
// });

Meteor.startup(function() {
  var coords = Meteor.call('getFreeSpace',function(err,res) {
    var user_id = Session.get('user_id');
    if (!user_id) {
      user_id = Partiers.insert({
        creationDate : new Date(),
        x : res.x,
        y : res.y,
        stream : null
      })
    }
    Session.set('user_id',user_id)
  });

  $(document).keydown(function(e){
    var keys = {
      37 : {dx:-1,dy: 0}, 
      38 : {dx: 0,dy:-1},
      39 : {dx: 1,dy: 0},
      40 : {dx: 0,dy: 1}
    }
    var move = keys[e.keyCode];
    if (move) {
      // console.log(move);
      moveUser(move);
    };
  });

  Meteor.setInterval(function() {
    Partiers.update(Session.get('user_id'),{$set:{last_seen:new Date()}});
  },HEARTBEAT_INTERVAL);

  Meteor.setTimeout(drawVids,1000);
});

var observer;

var moveUser = function(change) {
  var u = Partiers.findOne(Session.get('user_id'));
  var newx = Math.max(0,u.x+change.dx);
  var newy = Math.max(0,u.y+change.dy);

  if (Partiers.find({x:newx,y:newy}).count() != 0) {
      return; // Collision, dont do anything
  }

  console.log(newx,newy);
  Partiers.update({_id:Session.get('user_id')},{$set:{x : newx, y : newy}}); // Update the user's x and y
  var u = Partiers.findOne(Session.get('user_id'));
  // console.log(u);

  if (observer) {
    observer.stop();
  }
  observer = Partiers.find({$and : [{x:{$gt:newx-1}},{x:{$lt:newx+1}},{y:{$gt:newy-1}},{y:{$lt:newy+1}}]}).observe({added:drawVids,changed:drawVids,removed:drawVids}); // This is fucked
  // drawVids();
} 

var drawVids = function() {
  console.log('drawVids');
  var u = Partiers.findOne(Session.get('user_id'));
  for (var x=-1;x<2;x++) {
    for (var y=-1;y<2;y++) {
      var nu = Partiers.findOne({x:u.x+x,y:u.y+y});
      var vidEl = $('#' + (x+1) + '-' + (y+1));
      if (nu) {
        vidEl.css({'background-color':'green'});
      } else if (u.x+x<0 || u.y+y<0 || u.x+x>=WORLD_SIZE || u.y+y>=WORLD_SIZE) {
        vidEl.css({'background-color':'black'});
      } else {
        vidEl.css({'background-color':'red'});
      }
    }
  }
};
