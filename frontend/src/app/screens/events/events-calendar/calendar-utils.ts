import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { CalendarDateFormatter, CalendarUtils, DateFormatterParams } from 'angular-calendar';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';
import { addWeeks, startOfMonth } from 'date-fns';

/**
 * Class to ensure 6 weeks are always displayed on the calendar.
 * This ensures there is no height shifts when moving between months.
 */
@Injectable()
export class CustomCalendarUtils extends CalendarUtils {
  override getMonthView(args: GetMonthViewArgs): MonthView {
    const viewStart = startOfMonth(args.viewDate);
    return super.getMonthView({
      ...args,
      viewStart,
      viewEnd: addWeeks(viewStart, 5)
    });
  }
}

@Injectable()
export class CustomCalendarDateFormatter extends CalendarDateFormatter {
  override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale ?? 'en');
  }
}
