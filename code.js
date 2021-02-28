var calendarName = 'Time Tracker';
var startDate = "01-27-2021";
var endDate = "02-27-2021";

var calendar = CalendarApp.getCalendarsByName(calendarName)[0];

function logTotals() {
  var dailyTotalsObject = obtainDailyTotals(startDate, endDate);
  var dailyTotalsMap = {}

  dailyTotalsObject.dailyTotalsArray.forEach(function(dailyTotal){
    if (Object.keys(dailyTotal).length === 1) return;

    Logger.log("  Date: " + dailyTotal.date.toLocaleDateString("en-US"));

    for (let event in dailyTotal) {
      if (event === "date") continue;
      
      var duration = Number(minsToHrs(dailyTotal[event]));

      if (dailyTotalsMap[event]) {
        dailyTotalsMap[event] += duration
      } else {
        dailyTotalsMap[event] = duration
      }

      Logger.log(`      ${event}: ${duration} hours`);
    }    
  })

  Logger.log('')
  for (event in dailyTotalsMap) {
    const eventTotal = dailyTotalsMap[event];
    Logger.log(`Total for ${event}: ${eventTotal}`);
  }
}

function visualizeTotals() {
  var dailyTotalsObject = obtainDailyTotals(startDate, endDate);
  var spreadsheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1ku1P2ZyD9S7PEs0BubNldl4LDlehlP6x4znfkYhpBoE/edit');
  
  var sheet = spreadsheet.getSheets()[0];

  sheet.clear()

  var charts = sheet.getCharts();
  for(var i=0; i<charts.length; i++){
    sheet.removeChart(charts[i]);
  }

  sheet.appendRow(["date", ...dailyTotalsObject.eventsList])
  
  for (var dailyTotals of dailyTotalsObject.dailyTotalsArray) {
    var row = [formatDate(new Date(dailyTotals.date))];
    
    for (var event of dailyTotalsObject.eventsList) {
      if(dailyTotals[event]) row.push(minsToHrs(dailyTotals[event]));
      else row.push(0)
    }
    
    sheet.appendRow(row);
  }

  var range = sheet.getRange(1, 1, sheet.getLastRow(), 3);


  var chartBuilder = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(range)
      .setPosition(5, 5, 0, 0)
      .setNumHeaders(1)
      .build();

  sheet.insertChart(chartBuilder);
}

function obtainDailyTotals(startDate, endDate) {
  var indexDate = new Date(startDate);
  var endDate = new Date(endDate);

  var dailyTotalsArray = [];
  var eventsList = [];

  while (indexDate.getTime() <= endDate.getTime()) {
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
    
