export class Subscription{

    companyName:String;
    name:String;
    phoneNumber:number;
    puk:number;
    dataDefault:number;
    dataTotal:number;
    dataUsed:number;
    dataNotified:boolean;
    priceDefault:number;
    priceTotal:number;
    additionalProducts:any;

    constructor(jsonData){
        this.companyName = jsonData.companyName;
        this.name = jsonData.name;
        this.phoneNumber = jsonData.phoneNumber;
        this.puk = jsonData.puk;
        this.dataDefault = jsonData.dataDefault;
        this.dataTotal = jsonData.dataTotal;
        this.dataUsed = jsonData.dataUsed;
        this.dataNotified = jsonData.dataNotified;
        this.priceDefault = jsonData.priceDefault;
        this.priceTotal = jsonData.priceTotal;
        this.additionalProducts = jsonData.additionalData;
    }


}