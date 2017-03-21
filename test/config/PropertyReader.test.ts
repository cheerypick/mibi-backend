import * as mocha from 'mocha';
import chaiHttp = require('chai-http');
import {PropertyReader} from "../../src/config/PropertyReader";
let chai = require('chai');


let propertyReader = new PropertyReader();
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

let config = require('../../config.json');

let fireBaseProd = {
    "apiKey": "AIzaSyCybd1m2gcbHCcDkkrx8h3DZw7WPGIdxdE",
    "authDomain": "mibi-f0d90.firebaseapp.com",
    "databaseURL": "https://mibi-f0d90.firebaseio.com",
    "storageBucket": "mibi-f0d90.appspot.com",
    "messagingSenderId": "703686049206"
}
let fireBaseAdriano = {
    "apiKey": "AIzaSyANOj9JDBYXAYgqXl5sE58xpw1IVG9CudM",
    "authDomain": "mibi-55bb1.firebaseapp.com",
    "databaseURL": "https://mibi-55bb1.firebaseio.com",
    "storageBucket": "mibi-55bb1.appspot.com",
    "messagingSenderId": "271655106157"
}

describe('Getting wit config', () => {
    it('Should return an access token for Wit', () => {
        return expect(propertyReader.getAccessToken()).to.equal(config.wit.authentication.accessToken);
    });
});

describe('Getting server config', () => {
    it('Should return the server port', () => {
        return expect(propertyReader.getServerPort()).to.equal(config.server.connection.port);
    });
    it('Should return the server host', () => {
        return expect(propertyReader.getServerHost()).to.equal(config.server.connection.host);
    });
});

describe('Getting firebase config', () => {
    it('Should return the prod configuration', () => {
        return expect(propertyReader.getProductionFireBaseConfiguration()).to.deep.equal(fireBaseProd);
    });
    it('Should return the adriano configuration', () => {
        return expect(propertyReader.getAdrianoFireBaseConfiguration()).to.deep.equal(fireBaseAdriano);
    })
});
