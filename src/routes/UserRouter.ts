import {Router, Request, Response} from 'express';
const users = require('../../resources/users.json');

export class UserRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getUser);
        this.router.get('/:id/updates', this.getUpdates);
    }

    public getAll(req: Request, res: Response) {
        res.send(users);
    }

    public getUser(req: Request, res: Response) {
        let query = parseInt(req.params.id);
        let user = users.find(user => user.id === query);

        if (user) {
            res.status(200).send(user);
        } else {
            res.send({message: 'User with given ID not found.', status: 404});
        }
    }

    public getUpdates(req: Request, res: Response) {
        let query = parseInt(req.params.id);
        let user = users.find(user => user.id === query);

        if (user) {
            res.status(200).send(user.updates);
        } else {
            res.send({message: 'No updates found on given user.', status: 404});
        }
    }
}

const userRoutes = new UserRouter();
export default userRoutes.router;


