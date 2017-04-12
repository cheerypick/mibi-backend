import * as mocha from 'mocha';
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
    dataTotal: 2000
}
let entities = {
    number: {
        0: {
            value: 90605040
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
    it('Should return a future date response', () => {
        let response = MibiWitFunctions.createFutureDateResponse(new Date());
        expect(response).to.have.key('text');
    })
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
        let context = {}

        let response = MibiWitFunctions.createJokeContext(context);
        expect(response).to.have.key('joke');
    });
    it('Should return an invoice context', () => {
        let context = {}
        let date = new Date();

        let response = MibiWitFunctions.createInvoiceContext(context, subscription, socket, date);
        expect(response).to.have.keys(['time','total','link']);
    });
});


// let total = 0;
// // let date = new Date(entities.datetime[0].value);
//
// let link = 'https://fakturahotel.no/' + socket._userInfo.company + '/' + date.getFullYear() + '/' + (date.getMonth() + 1);
// link = _.replace(link, ' ', '_');
//
// // let array = subscriptions.val();
//
// for (let subscription in subscriptions) {
//     total += subscriptions[subscription].priceTotal;
// }
//
// context.time = dateformat(date, 'mm/yyyy');
// // context.time = date.getDay()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
// context.total = total;
// context.link = link;
//
// return context;

describe('Data validation', () => {
    it('Should return a date one year back according to rule processing', () => {
        let date = new Date();
        date.setFullYear(date.getFullYear()+2);

        let valDate = MibiWitFunctions.validateDate(date);
        date.setFullYear(date.getFullYear()-1);

        expect(valDate).to.equal(date);
    });
    it('Should return the same date', () => {
        let date = new Date();
        date.setFullYear(date.getFullYear()-1);

        expect(MibiWitFunctions.validateDate(date)).to.equal(date);
    })
});
