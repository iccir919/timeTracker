var calendarName = 'Time Tracker';
var startDate = "09-07-2023";
var endDate = "11-07-2023";
var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
var countOnlyWeekdays = false;

function logTotals() {
  var result = getDailyEventTotals(startDate, endDate, countOnlyWeekdays);
  var eventDurationSums = {}

  result.dailyEventsData.forEach(function(data){
    Logger.log("Date: " + data.date.toLocaleDateString("en-US"));
    for (let event in data.events) {
      var duration = Number(minsToHrs(data.events[event]));

      if (eventDurationSums[event]) {
        eventDurationSums[event] += duration
      } else {
        eventDurationSums[event] = duration
      }
      Logger.log(`    ${event}: ${duration} hours`);
    }    
  })


  Logger.log('')
  for (event in eventDurationSums) {
    const eventDurationSum = eventDurationSums[event];
    const weekendsMessage =  `${countOnlyWeekdays === true ? 'Not including' : 'Including'} weekends.`;
    let numberOfDays = result.dailyEventsData.length;
    if (event === "work") {
      // Account for PTO days
      numberOfDays = result.dailyEventsData.filter(day => day.events.work !== undefined).length
    }
    Logger.log(`Total for ${event}: ${eventDurationSum}`);
    Logger.log(`Average for ${event} per day: ${eventDurationSum / numberOfDays} hours; ${weekendsMessage}`)
  }
}

function visualizeTotals() {
  var result = getDailyEventTotals(startDate, endDate, countOnlyWeekdays);
  var spreadsheet = SpreadsheetApp.openByUrl(
    'https://docs.google.com/spreadsheets/d/1ku1P2ZyD9S7PEs0BubNldl4LDlehlP6x4znfkYhpBoE/edit');
  
  var sheet = spreadsheet.getSheets()[0];

  sheet.clear()

  var charts = sheet.getCharts();
  for(var i=0; i<charts.length; i++){
    sheet.removeChart(charts[i]);
  }

  sheet.appendRow(["date", ...result.eventsList])
  
  for (var dailyTotals of result.dailyEventsData) {
    var row = [formatDate(new Date(dailyTotals.date))];
    
    for (var event of result.eventsList) {
      if(dailyTotals.events[event]) row.push(minsToHrs(dailyTotals.events[event]));
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

function getDailyEventTotals(startDate, endDate, countOnlyWeekdays) {
    var indexDate = new Date(startDate);
    var endDate = new Date(endDate);
    var dailyTotalsArray = [];
    var eventsList = [];

    while (indexDate.getTime() <= endDate.getTime()) {

        if (countOnlyWeekdays && isWeekend(indexDate)) {
          indexDate.setDate(indexDate.getDate() + 1);
          continue;
        }

        var eventsForDay = calendar.getEventsForDay(indexDate);
        var dailyTotals = { date: new Date(indexDate) };
        var eventDurations = {};

        for (var event of eventsForDay) {
          var title = event.getTitle();

          if(!eventsList.includes(title)) eventsList.push(title);
          var duration = diffMinutes(event.getEndTime(), event.getStartTime());
          if (eventDurations[title]) {
            eventDurations[title] += duration;
          } else {
            eventDurations[title] = duration;
          }
        }
        dailyTotals.events = eventDurations;
        dailyTotalsArray.push(dailyTotals);
        indexDate.setDate(indexDate.getDate() + 1);
    }
    return {
      "dailyEventsData": dailyTotalsArray,
      "eventsList": eventsList
    };
}

function isWeekend(givenDate) {
  var currentDay = givenDate.getDay();
  var dateIsInWeekend = (currentDay === 6) || (currentDay === 0);
  if(dateIsInWeekend==true){
    return true;
  } else {
    return false;
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
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return `${days[date.getDay()]}, ${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
}
    
