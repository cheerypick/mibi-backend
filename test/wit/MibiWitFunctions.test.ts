import * as mocha from 'mocha';
import chaiHttp = require('chai-http');
let chai = require('chai');
import {fbDbReader} from "../../src/index";
import {MibiWitFunctions} from "../../src/wit/MibiWitFunctions";

let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;


describe('Creating responses', () => {
    it('Should return number not found response', () => {
        let response = MibiWitFunctions.createNumberNotFoundResponse();
        expect(response).to.have.key('text');
        expect(response).to.not.have.key('quickreplies');
    });
    it('Should return numbers found response', () => {
        let response = MibiWitFunctions.createNumbersFound(['90605040', '40605090']);
        expect(response).to.have.key('text');
        expect(response).to.have.key('quickreplies');
        expect(response).key('quickreplies').to.equal(['90605040', '40605090']);
    });
});