export class scoreFilterValueConverter {
  toView(scores, subjectid) {
    return scores.filter(score => score.assignment.subject_id === subjectid);
  }
}
