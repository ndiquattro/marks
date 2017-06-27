export class scoreFilterValueConverter {
  toView(scores, subjectid) {
    return scores.filter(score => score.assref.subjid === subjectid);
  }
}
