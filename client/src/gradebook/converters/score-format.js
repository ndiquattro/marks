export class ScoreFormatValueConverter {
  toView(value, assignInfo) {
    if (assignInfo.type === 'Points' && assignInfo.max !== 0) {
      return `${Math.round((value / assignInfo.max) * 100)}%`;
    } else if (assignInfo.type === 'Points') {
      if (value === null) {
        return '_';
      } else {
        return value;
      }
    }
  }
}
