export class Settings {
  constructor() {
    this.sectionSelected = null;
    this.sections = ['Profile', 'Change Password'];
  }

  activate(params) {
    if (params.section) {
      this.sectionSelected = params.section;
    }
  }
}
