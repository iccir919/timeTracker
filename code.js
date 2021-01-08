var calendarName = 'Time Tracker';
var fromNumberOfDaysAgo = 50;

var calendar = CalendarApp.getCalendarsByName(calendarName)[0];

function main(){
  var dailyTotalsArray = obtainDailyTotals(fromNumberOfDaysAgo);
  
  logTotals(dailyTotalsArray);
  visualizeTotals(dailyTotalsArray);
}

function logTotals(dailyTotalsArray) {
  for (let dailyTotal of dailyTotalsArray) {
    logResults(dailyTotal);
  }
}

function visualizeTotals(dailyTotalsArray) {
  var spreadsheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1ku1P2ZyD9S7PEs0BubNldl4LDlehlP6x4znfkYhpBoE/edit');
 
}

function obtainDailyTotals(fromNumberOfDaysAgo) {
  var today = new Date();
  var indexDate = new Date();
  indexDate.setDate(today.getDate() - fromNumberOfDaysAgo);
  var dailyTotalsArray = [];

  while (indexDate.getTime() <= today.getTime()) {
    daysEvents = calendar.getEventsForDay(indexDate);
    
    dailyTotal = calculateEventsDuration(indexDate, daysEvents);
    
    dailyTotalsArray.push(dailyTotal)
    
    indexDate.setDate(indexDate.getDate() + 1);
  }
  return dailyTotalsArray;
}

function calculateEventsDuration(date, events) {
  var dailyEvents = {};
  dailyEvents.date = new Date(date);
  for (let event of events) {
    var title = event.getTitle();
    var duration = diffMinutes(event.getEndTime(), event.getStartTime());
    
    if (dailyEvents[title]) {
      dailyEvents[title] += duration;
    } else {
      dailyEvents[title] = duration;
    }
  }
  return dailyEvents;
}

function logResults(dailyTotal) {
  if (Object.keys(dailyTotal).length === 1) return;
  Logger.log("  Date: " + dailyTotal.date.toLocaleDateString("en-US"));
  for (let event in dailyTotal) {
    if (event === "date") continue;
    
    var duration = (dailyTotal[event] / 60).toFixed(2);
    Logger.log(`      ${event}: ${duration} hours`);
  }
}

function diffMinutes(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
    
    