export class ScoreFormatValueConverter {
  toView(value, assignInfo) {
    if (assignInfo.type === 'Points') {
      return `${Math.round((value / assignInfo.max) * 100)}%`
    }
  }
}
