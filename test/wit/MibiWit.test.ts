import * as mocha from 'mocha';
import chaiHttp = require('chai-http');
let chai = require('chai');
import {MibiWit} from "../../src/wit/MibiWit";
import {PropertyReader} from "../../src/config/PropertyReader";

let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

describe('Getting client', () => {
    it('Should return a wit client', () => {
        let io, socket, mfb;
        let propertyReader = new PropertyReader();
        let response = MibiWit.getClient(io, propertyReader, socket, mfb, 'mibi');

        expect(response).to.have.keys('_sessions','config','converse','message','runActions')
        expect(response['config']).to.have.keys('accessToken','actions','witURL','apiVersion','headers','logger');
        expect(response['config']['actions']).to.contain.keys(['send','getPukPhoneNumber','getPuk','getInvoice','getUpdate','orderData','checkForUpdates','getJoke','sendEmail']);
        expect(response['config']['headers']).to.have.keys(['Authorization','Accept','Content-Type']);
        expect(response['config']['logger']).to.have.keys(['level','debug','info','warn','error']);
    });
});
