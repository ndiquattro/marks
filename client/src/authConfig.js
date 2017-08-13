let configForDevelopment = {
  baseUrl: 'http://localhost:5000/',
  loginRedirect: 'gradebook',
  loginRoute: '/'
};

let configForProduction = {
  baseUrl: 'https://www.reportmarks.com/',
  loginRedirect: 'gradebook',
  loginRoute: '/'
};

let config;
if (window.location.hostname === 'localhost') {
  config = configForDevelopment;
} else {
  config = configForProduction;
}

export default config;
