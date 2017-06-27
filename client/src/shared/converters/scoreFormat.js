export class ScoreFormatValueConverter {
  toView(score, meta) {
    if (meta.type === 'Checks') {
      return this.checks(score);
    } else if (meta.type === 'Points' & meta.max !== 0) {
      return this.percent(score, meta);
    }

    return score;
  }

  checks(score) {
    if (score === 1) {
      return '<i class="fa fa-check-circle-o fa-2x" aria-hidden="true"></i>';
    }

    return '<i class="fa fa-circle-o fa-2x" aria-hidden="true"></i>';
  }

  percent(score, meta) {
    return `${Math.round((score / meta.max) * 100)}%`;
  }
}
