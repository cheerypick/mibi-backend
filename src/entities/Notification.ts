export class Notification{

    title:string;
    body:string;
    sound:string = "default";
    witAction:string;
    click_action:String = "FCM_PLUGIN_ACTIVITY";

    constructor(title:string, body:string, witAction:string){
        this.title = title;
        this.body = body;
        this.witAction = witAction;
    }

}