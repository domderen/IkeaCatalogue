import {ImportIO} from './components/importIO'

var ikeaBaseUrl = 'http://www.ikea.com/us/en/search/?category=products';

export class App{
  static inject() { return [ImportIO]; }
  constructor(ImportIO){
    this.importIOClient = ImportIO;
    this.results = [];

    this.clientCredentials = {
      userGuid: '',
      apiKey: '',
      connectorGuid: ''
    };

    this.parameters = {
      query: '',
      min_price: 1,
      max_price: 10000,
      color: '',
      department: '',
      sorting: ''
    };

    this.colorValues = ['black', 'blue', 'brown', 'gray', 'green', 'red', 'white', 'yellow', 'other colors'];
    this.departmentValues = ['bathroom', 'bedroom', 'childrens_ikea', 'cooking', 'decoration', 'dining', 'eating', 'food', 'hallway'];
    this.sortingValues = ['name', 'price', 'newest'];
  }

  getImageUrl(url) {
    return url._value || url;
  }

  buildParameter(parameterName, parameterValue) {
    if(typeof parameterValue !== "string") {
      parameterValue = parameterValue.toString();
    }

    if(parameterValue.trim() !== '') {
      return '&' + parameterName + "=" + parameterValue;
    }

    return '';
  }

  buildIkeaUrl() {
    var url = ikeaBaseUrl;
    for(var param in this.parameters) {
      url += this.buildParameter(param, this.parameters[param]);
    }

    return url;
  }

  go(e) {
    var self = this;
    e.preventDefault();

    if(!this.importIOClient.isInitialized) {
      this.importIOClient.init(this.clientCredentials.userGuid, this.clientCredentials.apiKey);
    }

    var url = this.buildIkeaUrl();

    this.importIOClient.query({input: { "webpage/url": url },connectorGuids: [ this.clientCredentials.connectorGuid ], asObjects: true })
      .then(result => {
        self.results = result; console.log(result);
      }, error => { console.log(error); });
  }
}
