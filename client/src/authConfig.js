let configForDevelopment = {
  baseUrl: 'http://localhost:5000/',
  loginRedirect: '#/gradebook'
};

let configForProduction = {
};

let config;
if (window.location.hostname === 'localhost') {
  config = configForDevelopment;
} else {
  config = configForProduction;
}

export default config;
