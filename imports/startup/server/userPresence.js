import { Meteor } from "meteor/meteor";

if (Meteor.isTest) {
  return;
}

UserPresence.start();
// Active logs for every changes
// Listen for changes in UserSessions and Meteor.users
// to set user status based on active connections
UserPresenceMonitor.start();
