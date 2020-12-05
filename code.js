var calendarName = 'Time Tracker';
var calendar;
var todaysEvents;
var durationMap = {};

function main() {
  getTodaysEvents();
  calculateEventsDuration();
  displayResults();
}

function getTodaysEvents() {
  calendar = CalendarApp.getCalendarsByName(calendarName)[0];
  var today = new Date();
  todaysEvents = calendar.getEventsForDay(today);
}

function calculateEventsDuration() {
  for (let event of todaysEvents) {
    var title = event.getTitle();
    var duration = diffMinutes(event.getEndTime(), event.getStartTime());
    
    if (durationMap[title]) {
      durationMap[title] += duration;
    } else {
      durationMap[title] = duration;
    }
  }
<<<<<<< HEAD
  return durationMap;
}

function logResults(durationMap) {
  Logger.log("  Date: " + durationMap.date.toLocaleDateString("en-US"));
  for (let event in durationMap) {
    if (event === "date") continue;
    
    var duration = (durationMap[event] / 60).toFixed(2);
    Logger.log(`      ${event}: ${duration} hours`);
=======
}

function displayResults() {
  for (let event in durationMap) {
    var duration = (durationMap[event] / 60).toFixed(2);
    Logger.log(`    ${event}: ${duration} hours`);
>>>>>>> 4efc02d12124dede58079bf821a5dd9fb5458a1f
  }
}

function diffMinutes(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
