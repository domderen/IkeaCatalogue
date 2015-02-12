import {ImportIO} from './components/importIO'

export class Client{
  static inject() { return [ImportIO]; }
  constructor(ImportIO){
    this.importIOClient = ImportIO.client;
  }
}
