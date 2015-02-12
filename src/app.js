import {ImportIO} from './components/importIO'

var ikeaBaseUrl = 'http://www.ikea.com/us/en/search/?category=products';

export class Client{
  static inject() { return [ImportIO]; }
  constructor(ImportIO){
    this.importIOClient = ImportIO;
    this.results = [];

    this.clientCredentials = {
      userGuid: '',
      apiKey: ''
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
    e.preventDefault();

    if(!this.importIOClient.isInitialized) {
      this.importIOClient.init(this.clientCredentials.userGuid, this.clientCredentials.apiKey);
    }

    var url = this.buildIkeaUrl();

    this.importIOClient.query({input: { "webpage/url": url },connectorGuids: [ '21c3aa7b-a3e4-40c1-897b-117de0322a42' ], asObjects: true })
      .then(result => { this.results = result; console.log(result); }, error => { console.log(error); });
  }
}
