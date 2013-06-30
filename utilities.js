WORLD_SIZE = 100;
HEARTBEAT_INTERVAL = 2000; // 2 seconds
PURGE_INTERVAL = 2000; // 2 seconds
PURGE_TIME = 1 * 60; // if not seen in this many seconds, remove the partier


// runs the fn in a fiber, with params from params array
runInFiber = function(fn, params) {
  return Fiber( function() {
    fn.apply(null,params);
  }).run();
};