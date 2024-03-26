const Meeting = require('google-meet-api').meet;

Meeting({
clientId : '900631543829-0jjagfht4m75ehgv3in45elahvikhf6l.apps.googleusercontent.com',
clientSecret : "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",
refreshToken : 'XXXXXXXXXCNfW2MMGvJUSk4V7LplXAXXXX',
date : "2020-12-01",
time : "10:59",
summary : 'summary',
location : 'location',
description : 'description'
}).then(function(result){
console.log(result);//result is the final link
})