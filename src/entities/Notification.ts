export class Notification{

    title:string;
    body:string;
    sound:string = "default";
    witAction:string;

    // message:string;
    // icon:string = "icon";

    constructor(title:string, body:string, witAction:string){
        this.title = title;
        this.body = body;
        this.witAction = witAction;

        // this.message = body;
    }

}



// "title"	=> "title data",
//     "message" => "messaggio bello",
//     "priority" => "high",
//     "force-start" => 1,
//     "sound" => "default",
//     "icon" => "icon",