export class Notification{

    title:string;
    body:string;
    sound:string = "default";
    message:string;
    witAction:string;

    constructor(title:string, body:string, witAction:string){
        this.title = title;
        this.body = body;
        this.message = body;
        this.witAction = witAction;
    }

}
