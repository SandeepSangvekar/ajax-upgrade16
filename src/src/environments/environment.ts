// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://atapi.augtrans.com',
  // apiUrl: 'https://atapi.augtrans.com',
 apiUrl: 'http://172.16.15.18:8036',
  //(mapkey development)
 // mapApiKey : 'AIzaSyDITud13UV0N6Y58jk0AWInr5y52lJ4rsY',
 //mapApiKey : 'AIzaSyAOQfCXMr4w_jEqP8vlbM5uW_BzTYw7AdY',
  companyID: 'AJAXFIORI',
  //(mapkey production)
   mapApiKey : 'AIzaSyAMDelQFr1mwJz0whw7L9Bu1BFQ3hvbxZg',
  dpass : "Aj@x12345",
  labelpinno:"Pin No.",
  bootstrap : 30,
  alertValues:[{
    'coolantTempw1':100,
    'coolantTempw2':109,
    'coolantTempc':110,
    'batteryLevelc':8,
    'batteryLevelw1':10,
    'fuelLevelw1':'Reserve',
    'fuelLevelc':'Empty',
    'hydralicOilFilterChokec':'CHOKE',
    'oilpressurec':1
  }]
}; 

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
