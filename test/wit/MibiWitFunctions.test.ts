import * as mocha from 'mocha';
import * as dateformat from 'dateformat';
import chaiHttp = require('chai-http');
let chai = require('chai');
import {fbDbReader} from "../../src/index";
import {MibiWitFunctions} from "../../src/wit/MibiWitFunctions";

let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;

let subscription = {
    name: 'Some Name',
    puk: 123456,
    dataUsed: 1000,
    dataTotal: 2000,
    priceTotal: 200
}
let entities = {
    number: {
        0: {
            value: 90605040
        }
    },
    data: {
        0: {
            value: ' 1GB'
        }
    }
}
let socket = {
    _userInfo: {
        username: 'username',
        companyName: 'company'
    }
};

describe('Creating responses', () => {
    it('Should return number not found response', () => {
        let response = MibiWitFunctions.createNumberNotFoundResponse();
        expect(response).to.have.key('text');
        expect(response).to.not.have.key('quickreplies');
    });
    it('Should return numbers found response', () => {
        let response = MibiWitFunctions.createNumbersFoundResponse([90605040, 40605090]);
        expect(response).to.contain.key('text');
        expect(response).to.contain.key('quickreplies');
    });
});

describe('Creating contexts', () => {
    it('Should return a puk context', () => {
        let context = {};

        let response = MibiWitFunctions.createPukContext(context, subscription, entities);
        expect(response).to.contain.keys(['puk', 'name', 'number']);
        expect(response.puk).to.equal(subscription.puk);
        expect(response.name).to.equal(subscription.name);
        expect(response.number).to.equal(entities.number[0].value);
    });
    it('Should return an update context', () => {
        let context = {};

        let date = new Date();
        let daysLeft = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() - date.getDate();

        let response = MibiWitFunctions.createUpdatesContext(context, socket, subscription, entities);
        expect(response).to.have.keys(['subscription', 'used', 'total', 'days', 'admin']);
        expect(response.subscription).to.equal(subscription.name);
        expect(response.used).to.equal(subscription.dataUsed);
        expect(response.total).to.equal(subscription.dataTotal);
        expect(response.days).to.equal(daysLeft);
        expect(response.admin).to.equal(socket._userInfo.username);

        expect(socket).to.have.keys(['_userInfo', '_updateData']);
    });
    it('Should return a joke context', () => {
        let context = {};

        let response = MibiWitFunctions.createJokeContext(context);
        expect(response).to.have.key('joke');
    });
    it('Should return an invoice context', () => {
        let context = {};
        let date = new Date();

        let response = MibiWitFunctions.createInvoiceContext(context, subscription, socket, date);
        expect(response).to.have.keys(['time','total','link']);
    });
    it('Should return an email context', () => {
        let context = {};
        let email = 'someemail';

        let response = MibiWitFunctions.createEmailContext(context, email)
        console.log(response);
        expect(response).to.have.key('email');
        expect(response.email).to.equal(email);
    });
    it('Should return a future date context', () => {
        let context = {};
        let date = new Date();
        let fdate = dateformat(date, 'mm/yyyy');
        let response = MibiWitFunctions.createFutureDateContext(context, date);
        expect(response).to.have.key('future');
        expect(response.future).to.equal(fdate);
    })
});

describe('Checking updates', () => {
    it('Should return a message if an update is for the correct company', () => {
        let context = {}
        let updates = {
            '41639898':
                {
                    companyName: 'Lekebutikken',
                    number: '41639898',
                    path: '/companies/Lekebutikken/subscriptions/phoneNumbers/41639898/'
                }
        };
        let number = '41639898';
        let response = MibiWitFunctions.checkUpdates(context, updates, 'Lekebutikken');

        expect(response).to.have.keys(['text','reinit','mine','hidden']);
        expect(response.reinit).to.be.true;
        expect(response.hidden).to.be.true;
        expect(response.mine).to.be.true;
        expect(response.text).to.equal('datausage '+number);
    });
    it('Should trigger the hasUpdate path in WIT', () => {
        let context = {}
        let updates = {
            '41639898':
                {
                    companyName: 'Lekebutikken',
                    number: '41639898',
                    path: '/companies/Lekebutikken/subscriptions/phoneNumbers/41639898/'
                }
        };
        let response = MibiWitFunctions.checkUpdates(context, updates, 'Lekebutikken');

        expect(context).to.have.key('hasUpdate');
    });
    it('Should not return any updates and trigger the doesntHaveUpdate path in WIT', () => {
        let context = {};
        let updates = {};
        let response = MibiWitFunctions.checkUpdates(context, updates, 'Lekebutikken');

        expect(response).to.be.empty;
        expect(context).to.have.key('doesntHaveUpdates');
    })
});

describe('Processing order', () => {
    it('Should return necessary info to order datapackage', () => {
        let context = {};
        let valDate = new Date();
        valDate.setUTCMonth(valDate.getMonth()+1,1);
        valDate.setUTCHours(0,0,0,0)
        let {info, newData, newPrice, date} = MibiWitFunctions.processOrder(context, subscription, entities);

        expect(info).to.have.keys('data','price');
        expect(newData).to.equal(info.data+subscription.dataTotal);
        expect(newPrice).to.equal(info.price+subscription.priceTotal);
        expect(date.toString()).to.equal(valDate.toString());
    });
});


