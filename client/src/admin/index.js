export class Admin {
  constructor() {
    this.addCats = ['Years', 'Students', 'Subjects'];
    this.categorySelected = false;
  }

  setCategory(category) {
    this.categorySelected = category;
  }
}
