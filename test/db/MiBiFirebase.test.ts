import * as mocha from 'mocha';
import chaiHttp = require('chai-http');
let chai = require('chai');
import {MiBiFirebase} from '../../src/db/MiBiFirebase';


let db = new MiBiFirebase();
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

let company = 'Din Begravelse';
let phone = 41639898;
let puk = 456812;
let name = 'line johnsen';
let subscription = {
    additionalProducts: [{
        endDate: '2017-04-01T00:00:00.000Z',
        productName: 'DataPakke 2GB'
    }],
    companyName: 'Din Begravelse',
    dataDefault: 3000,
    dataNotified: false,
    dataTotal: 5000,
    dataUsed: 4384,
    name: 'john abrahamsen',
    priceDefault: 299,
    priceTotal: 499,
    puk: 456812
}
let subscriptions = {
    '41639898': {
        additionalProducts: [[Object]],
        companyName: 'Din Begravelse',
        dataDefault: 3000,
        dataNotified: false,
        dataTotal: 5000,
        dataUsed: 4384,
        name: 'john abrahamsen',
        priceDefault: 299,
        priceTotal: 499,
        puk: 456812
    },
    '91454568': {
        additionalProducts: [[Object]],
        companyName: 'Din Begravelse',
        dataDefault: 5000,
        dataNotified: false,
        dataTotal: 10000,
        dataUsed: 7460,
        name: 'tone fjellheim',
        priceDefault: 349,
        priceTotal: 599,
        puk: 124979
    },
    '94685512': {
        companyName: 'Din Begravelse',
        dataDefault: 5000,
        dataNotified: false,
        dataTotal: 5000,
        dataUsed: 2312,
        name: 'line johnsen',
        priceDefault: 349,
        priceTotal: 349,
        puk: 689461
    }
}

describe('Getting subscriptions', () => {
    it('Should return subscription for company and be equal to expected values', () => {
        return expect(db.getSubscription(company, phone)).to.eventually.deep.equal(subscription);
    });
    it('Should return all subscriptions for a company and be equal to expected values', () => {
        return expect(db.getSubscriptions(company)).to.eventually.contain.keys(['94685512','91454568','41639898']);
    });
});

describe('Getting puk', () => {
   it('Should return the puk of the requested user', () => {
       return expect(db.getPuk(company, phone)).to.eventually.equal(puk);
   });
});

describe('Getting numbers for person', () => {
    it('Should return all numbers for a person', () => {
        return expect(db.getNumbers(company, name)).to.eventually.have.key(name);
    });
    it('Should return all numbers for a person with an incomplete name', () => {
        return expect(db.getNumbers(company, name.substring(0,6))).to.eventually.have.key(name);
    });
});

