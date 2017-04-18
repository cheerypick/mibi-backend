import * as mocha from 'mocha';
import * as chai from 'chai';
import {DataUtil} from "../../src/util/DataUtil";

const expect = chai.expect;


describe('Testing isDataUsageUpdated', () => {
    it('Testing with different dataUsed, isUpdated should be true', () => {
        const oldData = {dataUsed: 400};
        const newData = {dataUsed: 5000};

        let result = DataUtil.isDataUsageUpdated(oldData, newData);
        expect(result.path).to.equal("/companies/");
        expect(result.isDataUpdate).to.equal(true);
    });

    it('Testing with same dataUsed, isUpdated should be false', () => {
        const oldData = {someValue1: "test1", dataUsed: 400};
        const newData = {someValue2: "test2", dataUsed: 400};

        let result = DataUtil.isDataUsageUpdated(oldData, newData);
        expect(result.isDataUpdate).to.equal(false);
    });
});

describe('Testing calculateDataPercentage', () => {
        it('1000 of 1000 used should result in 100%', () => {
            const dataUsed = 1000;
            const dataTotal = 1000;

            expect(DataUtil.calculateDataPercentage(dataUsed, dataTotal)).to.equal(100);
        });

        it('0 of 1000 used should result in 0%', () => {
            const dataUsed = 0;
            const dataTotal = 1000;

            expect(DataUtil.calculateDataPercentage(dataUsed, dataTotal)).to.equal(0);
        });

        it('10 of 1000 usded should result in 1%', () => {
           const dataUsed = 10;
           const dataTotal = 1000;

           expect(DataUtil.calculateDataPercentage(dataUsed, dataTotal)).to.equal(1);
        });
});


describe('Testing mapData', () => {
    it('Should handle whitespace', () => {
        const data = " 1GB";

        const result = DataUtil.mapData(data);

        expect(result.price).not.equal(0);
        expect(result.data).not.equal(0);
    });

    it('Price should be 129 for 3GB', () => {
        const data = "3GB";

        const result = DataUtil.mapData(data);

        expect(result.price).to.equal(129);
        expect(result.data).to.equal(3000);
    });

    it('Price should be 169 for 5GB', () => {
        const data = "5GB";

        const result = DataUtil.mapData(data);

        expect(result.price).to.equal(169);
        expect(result.data).to.equal(5000);
    });

    it('Invalid input should result in data: 0 and price: 0', () => {
        const data = "3000GB";

        const result = DataUtil.mapData(data);

        expect(result.price).to.equal(0);
        expect(result.data).to.equal(0);
    });
});

describe('Date validation', () => {
    it('Should return a date one year back according to rule processing', () => {
        let sdate = '2018-03-01T00:00:00.000-08:00';
        let valDate = DataUtil.validateDate(sdate);
        let date = new Date('2017-03-01T00:00:00.000-08:00');

        expect(valDate.toString()).to.equal(date.toString());
    });
    it('Should return the same date', () => {
        let sdate = '2016-03-01T00:00:00.000-08:00';
        let date = new Date(sdate);
        let valDate = DataUtil.validateDate(sdate);

        expect(valDate.toString()).to.equal(date.toString());
    })
});