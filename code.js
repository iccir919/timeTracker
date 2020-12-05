
function main(){
  var calendarName = 'Time Tracker';
  calendar = CalendarApp.getCalendarsByName(calendarName)[0];
  
  // Display totals from the past two weeks
  logLastTwoWeeksTotals(calendar);
  
  // Display todays totals to Logger
  logTodaysTotals(calendar);
}


function logLastTwoWeeksTotals(calendar) {
  var today = new Date();
  var indexDate = new Date();
  indexDate.setDate(today.getDate() - 14);
  
  while (indexDate.getTime() !== today.getTime()) {
    daysEvents = calendar.getEventsForDay(indexDate);
    durationMap = calculateEventsDuration(indexDate, daysEvents);
    logResults(durationMap);
    
    Logger.log("");
    indexDate.setDate(indexDate.getDate() + 1);
  }
}

function logTodaysTotals(calendar){
  var today = new Date();
  todaysEvents = calendar.getEventsForDay(today);
  durationMap = calculateEventsDuration(today, todaysEvents);
  logResults(durationMap);
}

function calculateEventsDuration(date, events) {
  var durationMap = {};
  durationMap.date = date;
  for (let event of events) {
    var title = event.getTitle();
    var duration = diffMinutes(event.getEndTime(), event.getStartTime());
    
    if (durationMap[title]) {
      durationMap[title] += duration;
    } else {
      durationMap[title] = duration;
    }
  }
  return durationMap;
}

function logResults(durationMap) {
  Logger.log("  Date: " + durationMap.date.toLocaleDateString("en-US"));
  for (let event in durationMap) {
    if (event === "date") continue;
    
    var duration = (durationMap[event] / 60).toFixed(2);
    Logger.log(`      ${event}: ${duration} hours`);
  }
}

function diffMinutes(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
    
    