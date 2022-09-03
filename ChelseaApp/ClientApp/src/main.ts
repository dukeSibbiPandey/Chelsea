import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { async } from 'rxjs';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

//const userAction =  () => {
//  fetch('/api/Global/con', {
//    method: 'GET',
   
//  }).then((res) => {
//    if (res.ok) {
//      return res.json();
//    } else {
//      throw new Error('Server response wasn\'t OK');
//    }
//  }).then((jsn) => {
//   (window as any).azure = jsn;
//    if (environment.production) {
//      enableProdMode();
//    }
//    platformBrowserDynamic().bootstrapModule(AppModule)
//      .catch(err => console.error(err));
//    return jsn;
//  });
//  // do something with myJson
 

//}
//var win = (window as any);
//const userAction = async () => {
//  var rese = await fetch('/api/Global/con', {
//    method: 'GET',

//  });

//  rese.json().then((res) => {
//    console.log(res);
//    win.azure = res;
//    return res;
//  }).then((js) => {
//    console.log(js);
//    setTimeout(() => {
//      //if (environment.production) {
//      //  enableProdMode();
//      //}
//      platformBrowserDynamic().bootstrapModule(AppModule)
//        .catch(err => console.error(err));
//    }, 2000);
//    return js;
//  });
//};
//var urls = [
//  '/api/Global/con'
  
//];

//// Maps each URL into a fetch() Promise
//var requests = urls.map(function (url) {
//  return fetch(url)
//    .then(function (response) {
//      // throw "uh oh!";  - test a failure
//      return response.json();
//    })
//});

//Promise.all(requests)
//  .then((results) => {
//    console.log(JSON.stringify(results, null, 2));
//    (window as any).azure = results[0];
//    setTimeout(() => {
//      if (environment.production) {
//        enableProdMode();
//      }
//      platformBrowserDynamic().bootstrapModule(AppModule)
//        .catch(err => console.error(err));
//    }, 500);
//  }).catch(function (err) {
//    console.log("returns just the 1st failure ...");
//    console.log(err);
//  })
  // do something with myJson
//userAction();


if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
