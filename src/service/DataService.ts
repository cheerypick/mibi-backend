import * as Diff from 'deep-diff';
import * as _ from 'lodash';

export class DataService{
    public static isDataUsageUpdate(oldData, newData): any {
        let json = Diff.diff(oldData,newData);
        if(json[0].path) {
            let path = "/companies";
            for (let key in json[0].path) {
                path += "/" + json[0].path[key];
            }
            let isDataUpdate = (_.includes(path, 'dataUsed'));
            path = _.replace(path, 'dataUsed','');
            return {path: path, isDataUpdate: isDataUpdate}
        }
    }
    public static dataUsed(dataUsed, dataTotal): number {
        return Math.round((dataUsed/dataTotal*100));
    }

    public static filterAdmins(admins, company){
        let filteredAdmins:any = [];
        for(let admin in admins){
            if(admins[admin].companyName === company){
                filteredAdmins.push(admin);
            }
        }
        return filteredAdmins;
    }

    public static mapData(data):any{
        data = _.replace(data, ' ', '');
        console.log('Mapping data "'+data+'" to price');
        if(data === '1GB'){
            return {data: 1000, price: 79};
        }else if(data === '3GB'){
            return {data: 3000, price: 129};
        }else if(data === '5GB'){
            return {data: 5000, price: 169};
        }
        return {data: 0, price: 0};
    }
}