var calendarName = 'Time Tracker';
var fromNumberOfDaysAgo = 30;

var calendar = CalendarApp.getCalendarsByName(calendarName)[0];

function logTotals() {
  var dailyTotalsObject = obtainDailyTotals(fromNumberOfDaysAgo);
  dailyTotalsObject.dailyTotalsArray.forEach(function(dailyTotal){
    logResults(dailyTotal);
  })
}

function visualizeTotals() {
  var dailyTotalsObject = obtainDailyTotals(fromNumberOfDaysAgo);
  var spreadsheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1ku1P2ZyD9S7PEs0BubNldl4LDlehlP6x4znfkYhpBoE/edit');
  
  var sheet = spreadsheet.getSheets()[0];
  sheet.appendRow(["date", ...dailyTotalsObject.eventsList])
  
  for (var dailyTotals of dailyTotalsObject.dailyTotalsArray) {
    var row = [formatDate(dailyTotals.date)];
    
    for (var event of dailyTotalsObject.eventsList) {
      if(dailyTotals[event]) row.push(minsToHrs(dailyTotals[event]));
      else row.push(0)
    }
    
    sheet.appendRow(row);
  }
  
}

function obtainDailyTotals(fromNumberOfDaysAgo) {
  var today = new Date();
  var indexDate = new Date();
  indexDate.setDate(today.getDate() - fromNumberOfDaysAgo);
  var dailyTotalsArray = [];
  var eventsList = [];

  while (indexDate.getTime() <= today.getTime()) {
    var daysEvents = calendar.getEventsForDay(indexDate);
    
    var dailyTotal = {};
    dailyTotal.date = new Date(indexDate);
    for (let event of daysEvents) {
      var title = event.getTitle();

      if(!eventsList.includes(title)) eventsList.push(title);

      var duration = diffMinutes(event.getEndTime(), event.getStartTime());
      
      if (dailyTotal[title]) {
        dailyTotal[title] += duration;
      } else {
        dailyTotal[title] = duration;
      }
    }
    
    dailyTotalsArray.push(dailyTotal)
    
    indexDate.setDate(indexDate.getDate() + 1);
  }
  
  return {
    "dailyTotalsArray": dailyTotalsArray,
    "eventsList": eventsList
  };
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
    
    var duration = minsToHrs(dailyTotal[event]);
    Logger.log(`      ${event}: ${duration} hours`);
  }
}

function diffMinutes(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

function minsToHrs(minutes) {
  return (minutes / 60).toFixed(2);
}

function formatDate(date) {
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
}
    