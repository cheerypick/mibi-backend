import * as mocha from 'mocha';
import * as chai from 'chai';
import {DataUsageHelper} from "../../src/service/DataUsageHelper";
import {Subscription} from "../../src/entities/Subscription";
import {User} from "../../src/entities/User";

const expect = chai.expect;

describe('Testing createNotification', () => {
    const name = "Supertester";
    const percentage = 100;
    const phoneNumber = 89786756;

    it('Should contain all values', () => {
        let notification = DataUsageHelper.createNotification(name, percentage, phoneNumber);

        expect(notification.witAction).contains(phoneNumber);
        expect(notification.body).contains(name);
        expect(notification.body).contains(percentage);
    });

    it('Should have correct formated Wit action', () => {
        let notification = DataUsageHelper.createNotification(name, percentage, phoneNumber);

        expect(notification.witAction).to.equal("datausage " + phoneNumber);
    });

    it('Name should have capital first letter', () => {
        const nameWithLowerCase = "litentester";

        let notification = DataUsageHelper.createNotification(nameWithLowerCase, percentage, phoneNumber);

        expect(notification.body).contains("Litentester");
    });
});


describe('Testing parsePhoneNumber', () => {

    it('Should remove all seperators', () => {
        const phoneNumber = "123456789";

        let result = DataUsageHelper.parsePhoneNumber("/" + phoneNumber + "/");

        expect(result).to.equal(phoneNumber);
    });

});

describe('Testing createUsageMessage', () => {

    it('Should contains all values', () => {
        const subscription:Subscription = new Subscription({name: "Ole", dataUsed: 800, dataTotal: 1000});

        let result = DataUsageHelper.createUsageMessage(subscription);

        expect(result).contains(subscription.name);
        expect(result).contains(subscription.dataUsed);
        expect(result).contains(subscription.dataTotal);
    });

});


describe('Testing filterAdminsByCompany', () => {

    it('Should return empty array on empty input', () => {
        let admins = DataUsageHelper.filterAdminsByCompany([], "");

        expect(admins).not.equal(null);
        expect(admins.length).to.equal(0);
    });

    it('Should only contain admins with companyName supertesters', () => {
        const companySuperTester = "supertesters";

        let admins:User[] = [];
        admins.push(new User("Random", "molo", 'token'));
        admins.push(new User(companySuperTester, "moba", 'token'));
        admins.push(new User(companySuperTester, "mobo", 'token'));

        let adminsFiltered = DataUsageHelper.filterAdminsByCompany(admins, companySuperTester);

        expect(adminsFiltered.length).to.equal(2);
    });

});
