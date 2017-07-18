import environment from './environment';
import config from './authConfig';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('validation')
    .globalResources([
      'shared/attributes/bootstrap-datepicker',
      'shared/attributes/bootstrap-select',
      'shared/attributes/tooltip',
      'shared/converters/dateFormat',
      'shared/converters/scoreFormat'
    ])
    .plugin('aurelia-auth', (baseConfig)=>{
      baseConfig.configure(config);
    });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
