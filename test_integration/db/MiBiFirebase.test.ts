import * as mocha from 'mocha';
import chaiHttp = require('chai-http');
let chai = require('chai');
import {fbDbReader} from "../../src/index";

let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

let company = 'Lekebutikken';
let phone = 41639898;
let puk = 456812;
let name = 'line johnsen';
let adminName = 'mibi';
let path = '/admins/mibi/name';
let adminEmail = 'line.johnsen@lekebutikken.no';

describe('Getting subscriptions', () => {
    it('Should return subscription for companyName and be equal to expected values', () => {
        fbDbReader.getSubscription(company, phone).then((subscription) => {
            expect(subscription).length.to.equal(1);
        });

    });
    it('Should return all subscriptions for a companyName and be equal to expected values', () => {
        fbDbReader.getSubscriptions(company).then((subscriptions) => {
            expect(subscriptions).length.to.equal(3);
        });
    });
});

describe('Getting puk', () => {
    it('Should return the puk of the requested user', () => {
        fbDbReader.getPuk(company, phone).then((puk) => {
            expect(puk).to.equal(puk);
        });
    });
});

describe('Getting numbers for person', () => {
    it('Should return all numbers for a person', () => {
        fbDbReader.getNumbers(company, name).then((numbers) => {
            expect(numbers).length.to.equal(1);
        });
    });
    it('Should return all numbers for a person with an incomplete name', () => {
        fbDbReader.getNumbers(company, name.substring(0,6)).then((numbers) => {
            expect(numbers).length.to.equal(1);
        });
    });
});

describe('Getting admins', () => {
    it('Should return all admins for a companyName', () => {
        fbDbReader.getAdminsForCompany(company).then((admins) => {
            expect(admins).length.to.equal(2);
        });
    });
    it('Should return a single admin', () => {
        fbDbReader.getAdmin(adminName).then((admin) => {
            expect(admin).length.to.equal(1);
        });
    });
    it('Should return all admins', () => {
        fbDbReader.getAdmins().then((admins) => {
            expect(admins).length.to.equal(3);
        });
    });
});

describe('Getting specific data', () => {
    it('Should return the exact data requested', () => {
        fbDbReader.getSpecificPath(path).then((data) => {
            expect(data).to.equal(name);
        });
    });
});

describe('Getting email for admin', () => {
    it('Should return the email address of an admin', () => {
        fbDbReader.getEmail(adminName).then((email) => {
            expect(email).to.equal(adminEmail);
        });
    });
});

describe('Getting updates', () => {
    it('Should not return null object for single subscription', () => {
        fbDbReader.getUpdate(phone).then((update) => {
            expect(update).to.not.equal(null);
        });
    });
    it('Should not return null object for all updates', () => {
        fbDbReader.getUpdates().then((updates) => {
            expect(updates).to.not.equal(null);
        });
    });
});
