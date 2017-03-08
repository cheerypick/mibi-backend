export class Subscription{

    private _companyName:String;
    private _name:String;
    private _phoneNumber:number;
    private _puk:number;
    private _dataDefault:number;
    private _dataTotal:number;
    private _dataUsed:number;
    private _dataNotified:boolean;
    private _priceDefault:number;
    private _priceTotal:number;
    private _additionalProducts:String;

    constructor(jsonData){
        this._companyName = jsonData._companyName;
        this._name = jsonData._name;
        this._phoneNumber = jsonData._phoneNumber;
        this._puk = jsonData._puk;
        this._dataDefault = jsonData._dataDefault;
        this._dataTotal = jsonData._dataTotal;
        this._dataUsed = jsonData._dataUsed;
        this._dataNotified = jsonData._dataNotified;
        this._priceDefault = jsonData._priceDefault;
        this._priceTotal = jsonData._priceTotal;
    }


    get companyName(): String {
        return this._companyName;
    }

    set companyName(value: String) {
        this._companyName = value;
    }

    get name(): String {
        return this._name;
    }

    set name(value: String) {
        this._name = value;
    }

    get phoneNumber(): number {
        return this._phoneNumber;
    }

    set phoneNumber(value: number) {
        this._phoneNumber = value;
    }

    get puk(): number {
        return this._puk;
    }

    set puk(value: number) {
        this._puk = value;
    }

    get dataDefault(): number {
        return this._dataDefault;
    }

    set dataDefault(value: number) {
        this._dataDefault = value;
    }

    get dataTotal(): number {
        return this._dataTotal;
    }

    set dataTotal(value: number) {
        this._dataTotal = value;
    }

    get dataUsed(): number {
        return this._dataUsed;
    }

    set dataUsed(value: number) {
        this._dataUsed = value;
    }

    get dataNotified(): boolean {
        return this._dataNotified;
    }

    set dataNotified(value: boolean) {
        this._dataNotified = value;
    }

    get priceDefault(): number {
        return this._priceDefault;
    }

    set priceDefault(value: number) {
        this._priceDefault = value;
    }

    get priceTotal(): number {
        return this._priceTotal;
    }

    set priceTotal(value: number) {
        this._priceTotal = value;
    }

    get additionalProducts(): String {
        return this._additionalProducts;
    }

    set additionalProducts(value: String) {
        this._additionalProducts = value;
    }
}