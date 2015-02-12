import {App} from '../../src/app';

class ImportIOStub {
  constructor() {
    this.isInit = true;
  }
  query() {
    return Promise.resolve(['someVal']);
  }

  get isInitialized() {
    return this.isInit;
  }

  set isInitialized(val) {
    this.isInit = val;
  }

  init() {}
}

describe('The App Module', () => {
  var sut;
  beforeEach(() => { sut = new App(new ImportIOStub()); });

  it('contains a import io client property', () => {
    expect(sut.importIOClient).toBeDefined();
  });
  
  it('initialized with empty results array', () => {
    expect(sut.results).toEqual([]);
  });

  describe('getImageUrl', () => {
    it('returns provided value, if it is a string', () => {
      expect(sut.getImageUrl('some string')).toEqual('some string');
    });

    it('returns _value key, if provided parameter is an object and has such property', () => {
      expect(sut.getImageUrl({_value: 'some string'})).toEqual('some string');
    });
  });

  describe('buildParameter', () => {
    it('returns empty string, if parameter value is empty', () => {
      expect(sut.buildParameter('someName', '')).toEqual('');
    });

    it('returns empty string, if parameter value contains only whitespace', () => {
      expect(sut.buildParameter('someName', '    ')).toEqual('');
    });

    it('returns proper string, if parameter value is not empty', () => {
      expect(sut.buildParameter('someName', 'someVal')).toEqual('&someName=someVal');
    });

    it('returns proper string, if parameter value is integer', () => {
      expect(sut.buildParameter('someName', 20)).toEqual('&someName=20');
    });
  });

  describe('buildIkeaUrl', () => {
    it('provides proper url when params are set', () => {
      sut.parameters.query = 'someQuery';
      expect(sut.buildIkeaUrl()).toEqual('http://www.ikea.com/us/en/search/?category=products&query=someQuery&min_price=1&max_price=10000');
    });
  });

  describe('go', () => {
    it('expect an event to be prevented on default action', () => {
      var event = {preventDefault: () => {}};
      spyOn(event, 'preventDefault');

      sut.go(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('expect init to be called when client is not initialized', () => {
      var event = {preventDefault: () => {}};
      spyOn(event, 'preventDefault');
      sut.importIOClient.isInitialized = false;
      spyOn(sut.importIOClient, 'init');

      sut.go(event);

      expect(sut.importIOClient.init).toHaveBeenCalledWith(sut.clientCredentials.userGuid, sut.clientCredentials.apiKey);
    });

    it('expect query to be successfully resolved.', (done) => {
      var event = {preventDefault: () => {}};
      spyOn(event, 'preventDefault');

      sut.go(event);

      setTimeout(() => {
        expect(sut.results).toContain('someVal');
        done();
      }, 1);
    })
  });
});
