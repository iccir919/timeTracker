function accessCalendar() {
  var calendarName = 'Time Tracker';
  var calendars = CalendarApp.getCalendarsByName(calendarName);
  Logger.log('Found %s matching calendars.', calendars.length);
}
