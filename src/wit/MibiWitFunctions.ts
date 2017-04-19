import * as _ from 'lodash';
import * as dateformat from 'dateformat';
import {DataUtil} from "../util/DataUtil";

export class MibiWitFunctions{

    public static getPukPhoneNumber(context, entities, io, socket, mibiFirebase, username) {
        return mibiFirebase.getNumbers(socket._userInfo.companyName,entities.name[0].value).then((numbers) => {
            let numberNotFound = numbers == null;
            if(numberNotFound){

                let response = this.createNumberNotFoundResponse();
                context.noNumber = true;
                return context;

                // mibiFirebase.postMessage(username, response);

             }else {
                let response = this.createNumbersFoundResponse(numbers);
                entities.number = [
                    {value: response.quickreplies[0]}
                ]
                delete context.noNumber;
                return this.getPuk(context, entities, socket, mibiFirebase, username);
                // mibiFirebase.postMessage(username, response);
            }
        });
    }

    public static getPuk(context, entities, socket, mibiFirebase, username) {

        console.log('getPuk');
        return mibiFirebase.getSubscription(socket._userInfo.companyName, entities.number[0].value).then((subscription) => {
            return this.createPukContext(context, subscription, entities);
        });
    }

    public static getInvoice(context, entities, io, socket, mibiFirebase, username){
        let date = entities.datetime[0].value
        let valDate = DataUtil.validateDate(date)
        if(valDate > new Date()) {
            return this.createFutureDateContext(context, valDate);
        }else {
            return mibiFirebase.getSubscriptions(socket._userInfo.companyName).then((subscriptions) => {
                return this.createInvoiceContext(context, subscriptions, socket, valDate);
            });
        }
    }


    public static getUpdate(context, entities, io, socket, mibiFirebase, username) {
        return mibiFirebase.getUpdate(entities.number[0].value).then((data) => {
            return mibiFirebase.getSubscription(data.companyName, data.number).then((data) => {
                return this.createUpdatesContext(context, socket, data, entities);
            });
        });
    }

    public static orderData(context, entities, io, socket, mibiFirebase, username){
        console.log('Ordering data');
        let phone = socket._updateData;
        return mibiFirebase.getUpdate(phone).then((data) => {
            return mibiFirebase.getSpecificPath(data.path).then((subscription) => {
                if(entities.data){
                    let {info, newData, newPrice, date} = this.processOrder(context, subscription, entities);

                    mibiFirebase.addProduct(subscription.companyName, phone, entities.data[0].value, newData, newPrice, date);
                }

                mibiFirebase.deleteUpdate(phone);
                return context;
            });
        });
    }

    public static processOrder(context, subscription, entities){
        let info = DataUtil.mapData(entities.data[0].value);
        let newData = subscription.dataTotal + info.data;
        let newPrice = subscription.priceTotal + info.price;

        let date = new Date();
        date.setUTCMonth(date.getMonth()+1,1);
        date.setUTCHours(0,0,0,0)
        context.newdata = entities.data[0].value;

        return {info, newData, newPrice, date};
    }

    public static checkForUpdates(context, entities, io, socket, mibiFirebase, username){
        return mibiFirebase.getUpdates().then((updates) => {
            let msg = this.checkUpdates(context, updates, socket._userInfo.companyName);
            if(msg){
                io.to(socket.id).emit('message', msg);
            }
            return context;
        });
    }

    public static checkUpdates(context, updates, companyName){
        context.doesntHaveUpdates=true;
        for(let update in updates){
            console.log('checking for updates');
            if(updates[update].companyName === companyName){
                console.log('Updates!!!');
                let msg = {
                    text: 'datausage '+updates[update].number,
                    reinit: true,
                    mine: true,
                    hidden: true
                };

                context.hasUpdate = true;
                delete context.doesntHaveUpdates;
                return msg;
            }
        }
    }

    public static createJokeContext(context) {
        let jokes = [
            'Har du hørt om hønene som hadde så høy feber at det bare kom kokte egg?',
            'Hva får du om du krysser et virus med en klovn? - Syk humor',
            'Jeg synes sauen din løper fort, spesielt med tanke på at den var født lam!',
            'Vet du et ord på tre bokstaver som starter med bensin? - Bil.'
        ];

        let max = jokes.length;
        let jokeNumber = Math.floor(Math.random() * (max));

        console.log('Telling joke number ' + jokeNumber);

        context.joke = jokes[jokeNumber];
        return context;
    }

    public static sendEmail(context, entities, io, socket, mibiFirebase, username) {
        return mibiFirebase.getEmail(socket._userInfo.username).then((email) => {
            return this.createEmailContext(context, email);
        })

    }

    public static createNumberNotFoundResponse() {
        return {text: 'Beklager, jeg finner ikke det navnet for din bedrift.'};
    }

    public static createNumbersFoundResponse(numbers) {
        let quickreplies = [];

        // let array = numbers.val();

        for (let number in numbers) {
            for (let num in numbers[number]) {
                quickreplies.push(numbers[number][num]);
            }
        }
        quickreplies.push("Nei, det er ingen av de nummerene");

        return {
            text: 'Hvilke av disse nummerene vil du ha PUK for?',
            quickreplies: quickreplies
        };
    }

    public static createFutureDateContext(context, date) {
        context.future = dateformat(date, 'mm/yyyy');
        return context;
    }

    public static createPukContext(context, subscription, entities) {
        context.name = _.startCase(subscription.name);
        context.puk = subscription.puk;
        context.number = entities.number[0].value;
        console.log(context);
        return context;
    }

    public static createUpdatesContext(context, socket, data, entities) {
        let date = new Date();
        let daysLeft = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() - date.getDate();
        context.subscription = _.startCase(data.name);
        context.used = data.dataUsed;
        context.total = data.dataTotal;
        context.days = daysLeft;
        context.admin = socket._userInfo.username;

        socket._updateData = entities.number[0].value;

        return context;
    }

    public static createInvoiceContext(context, subscriptions, socket, date: Date){
        let total = 0;

        let ndate = new Date(date);
        let link = 'https://fakturahotel.no/' + socket._userInfo.companyName + '/' + ndate.getFullYear() + '/' + (ndate.getMonth() + 1);
        link = _.replace(link, ' ', '_');

        for (let subscription in subscriptions) {
            total += subscriptions[subscription].priceTotal;
        }

        context.time = dateformat(date, 'mm/yyyy');
        // context.time = date.getDay()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
        context.total = total;
        context.link = link;

        return context;
    }

    public static createEmailContext(context, email){
        context.email = email;
        return context;
    }
}