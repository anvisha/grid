Meteor.startup(function () {

  Meteor.setInterval(function() {
    console.log('purging partiers...');
    var d = new Date();
    d.setSeconds(d.getSeconds()-PURGE_INTERVAL);
    Partiers.remove({last_seen:{$lt:d}});
  },PURGE_INTERVAL)


});

Meteor.methods({
  getFreeSpace : function() {
    for (var x = 0; x<WORLD_SIZE; x++) {
      for (var y = 0; y<WORLD_SIZE; y++) {
        if (Partiers.find({x:x,y:y}).count() == 0) {
          return {x:x,y:y}
        }
      }
    }
  }
});