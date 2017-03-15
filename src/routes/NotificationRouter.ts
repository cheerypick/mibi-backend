import {Router, Request, Response} from 'express';
import {PushNotificationService} from "../service/PushNotificationService";
import {Notification} from "../entities/Notification";

/**
 * Just for testing purpose, methods break DRY rule (OPS, sorry not sorry).
 */
export class NotificationRouter{

    router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/all', this.sendNotificationToAll);
        this.router.get('/ios', this.sendNotificationToIos);
        this.router.get('/user/:username', this.sendNotificationToAllDevicesForUser);
    }


    public sendNotificationToAll(req: Request, res: Response) {
        let pushNotificationService = new PushNotificationService();

        let result = pushNotificationService.sendNotificationToAll(new Notification("From web", "Only a test", "No action"));

        res.status(200).send("Notification sent!!!");
    }


    public sendNotificationToIos(req: Request, res: Response) {
        let pushNotificationService = new PushNotificationService();

        let result = pushNotificationService.sendNotificationToIos(new Notification("From web", "Only a test", "No action"));

        res.status(200).send("Notification sent!!!");
    }


    public sendNotificationToAllDevicesForUser(req: Request, res: Response){
        let pushNotificationService = new PushNotificationService();

        let user = req.params.username;
        let result = pushNotificationService.sendNotificationToUserDevices(user, new Notification("From web", "Only a test", "No action"));

        res.status(200).send("Notification sent!!!");
    }

}
