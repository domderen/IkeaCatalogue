import {ImportIO} from '../../src/components/importIO';

class ImportIOFactoryStub {
  constructor() {
    this.importIOConstructor = function () { return {
      connect: () => {},
      query: () => {}
    }; };
  }
}

describe('The ImportIO module', () => {
  var module;
  beforeEach(() => { module = new ImportIO(new ImportIOFactoryStub())});

  it('initialized with undefined importIO client', () => {
    expect(module.client).toBe(undefined);
  });

  describe('init', () => {
    it('initializes the module with passed parameters and import.io address', () => {
      var userGuid = '098';
      var appKey = '123';
      spyOn(module.importIO, 'importIOConstructor');

      module.init(userGuid, appKey);

      expect(module.importIO.importIOConstructor).toHaveBeenCalledWith(userGuid, appKey, 'import.io');
    });
  });

  describe('isInitialized', () => {
    it('returns false when client is undefined', () => {
      module.client = undefined;

      expect(module.isInitialized).toBe(false);
    });

    it('returns true when client is not undefined', () => {
      module.client = new module.importIO.importIOConstructor();

      expect(module.isInitialized).toBe(true);
    });
  });

  describe('connect', (done) => {
    it('resolves the promise successfully if connection was successful', () => {
      var myCb;
      var callback = (cb) => {
        myCb = cb;
      };
      module.client = new module.importIO.importIOConstructor();
      module.client.connect = callback;
      spyOn(module.client, 'connect').and.callThrough();

      var promise = module.connect();

      promise.then((connected) => {
        expect(connected).toBe(true);
        done();
      });

      myCb(true);
    });

    it('rejects the promise if connection was not successful', () => {
      var myCb;
      var callback = (cb) => {
        myCb = cb;
      };
      module.client = new module.importIO.importIOConstructor();
      module.client.connect = callback;
      spyOn(module.client, 'connect').and.callThrough();

      var promise = module.connect();

      promise.then(() => {}, error => {
        expect(error).toBe("Unable to connect");
        done();
      });

      myCb(false);
    });
  });

  describe('query', () => {
    it('resolves with data', (done) => {
      module.client = new module.importIO.importIOConstructor();
      var queryObj, callback;
      var query = (qo, cb) => {
        queryObj = qo;
        callback = cb;
      };
      module.client.query = query;
      spyOn(module.client, 'query').and.callThrough();
      spyOn(module, 'connect').and.returnValue(Promise.resolve(true));

      var myQueryObj = {someParam: 'someValue'};

      var promise = module.query(myQueryObj);

      setTimeout(() => {
        expect(module.client.query).toHaveBeenCalledWith(myQueryObj, jasmine.any(Function));

        promise.then((data) => {
          expect(data).toEqual(['someVal']);
          done();
        });

        callback(true, {type: 'MESSAGE', data: {results: ['someVal']}})
      }, 1);
    });

    it('rejects on disconnected message', (done) => {
      module.client = new module.importIO.importIOConstructor();
      var queryObj, callback;
      var query = (qo, cb) => {
        queryObj = qo;
        callback = cb;
      };
      module.client.query = query;
      spyOn(module.client, 'query').and.callThrough();
      spyOn(module, 'connect').and.returnValue(Promise.resolve(true));

      var myQueryObj = {someParam: 'someValue'};

      var promise = module.query(myQueryObj);

      setTimeout(() => {
        expect(module.client.query).toHaveBeenCalledWith(myQueryObj, jasmine.any(Function));

        promise.then(() => {}, (error) => {
          expect(error).toBe("The query was cancelled as the client was disconnected");
          done();
        });

        callback(true, {type: 'DISCONNECT'})
      }, 1);
    });

    it('rejects on error message', (done) => {
      module.client = new module.importIO.importIOConstructor();
      var queryObj, callback;
      var query = (qo, cb) => {
        queryObj = qo;
        callback = cb;
      };
      module.client.query = query;
      spyOn(module.client, 'query').and.callThrough();
      spyOn(module, 'connect').and.returnValue(Promise.resolve(true));

      var myQueryObj = {someParam: 'someValue'};

      var promise = module.query(myQueryObj);

      setTimeout(() => {
        expect(module.client.query).toHaveBeenCalledWith(myQueryObj, jasmine.any(Function));

        promise.then(() => {}, (error) => {
          expect(error).toContain("Got an error!");
          done();
        });

        callback(true, {type: 'MESSAGE', data: {errorType: 'some error'}})
      }, 1);
    });
  });
});
