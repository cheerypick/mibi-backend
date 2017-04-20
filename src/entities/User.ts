export class User{

    companyName: string;
    username: string;
    token: string;

    constructor(company: string, username: string, token: string){
        this.companyName = company;
        this.username = username;
        this.token = token;
    }
}