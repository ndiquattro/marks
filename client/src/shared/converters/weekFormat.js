import moment from 'moment';

export class WeekFormatValueConverter {
  toView(value) {
    return 'Week of ' + moment(value).format('MMMM Do');
  }
}
