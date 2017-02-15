"use strict";
const PR = require("properties-reader");
class PropertyReader {
}
exports.PropertyReader = PropertyReader;
let properties = null;
constructor();
{
    properties = PR('/c/Projects/MiBi/repos/mibi-backend');
}
accessToken();
{
    console.log(properties.get('main.awesome.test'));
}
