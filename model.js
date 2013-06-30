// All Partiers -- data model
// Loaded on both the client and the server

///////////////////////////////////////////////////////////////////////////////
// Partiers

/*
  Each partier is represented by a document in the Partiers collection:
    Properties:
        creationDate
        x
        y
        stream
*/
Partiers = new Meteor.Collection("partiers");

// if (Meteor.isServer) {
//   // publish single servers
//   Meteor.publish('servers', function (id) {
//     return Servers.find({_id: id});
//   });
// }