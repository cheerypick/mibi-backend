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
            let isDataUpdate = (_.includes(path, 'dataUsed');
            path = _.replace(path, 'dataUsed','');
            return {path: path, isDataUpdate: isDataUpdate}
        }
    }
    public static dataUsed(dataUsed, dataTotal): number {
        return (dataUsed/dataTotal*100);
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
}

                //
                // this.getSpecificPath(path).then((subscription) => {
                //     let dataTotal = subscription.dataTotal;
                //     let dataUsed = subscription.dataUsed;
                //     console.log('Data prosent: ' + (dataUsed/dataTotal*100));
                //     if((dataUsed/dataTotal*100) > 80){
                //         this.getAdmins().then((admins) => {
                //
                //         })
                //     }
                // });
