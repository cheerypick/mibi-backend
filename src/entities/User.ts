export class User{

    company: string;
    username: string;
    lastContact: Date;

    constructor(company: string, username: string){
        this.company = company;
        this.username = username;
        this.lastContact = new Date();
    }
}