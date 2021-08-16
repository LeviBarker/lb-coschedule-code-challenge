// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseAPIPath: "http://localhost:5001/levi-barker-code-challenge/us-central1/api/",
  firebase: {
    apiKey: "AIzaSyCA3s_YBvUDR60efX14dH-uzHbvJUgpYpI",
    authDomain: "levi-barker-code-challenge.firebaseapp.com",
    projectId: "levi-barker-code-challenge",
    storageBucket: "levi-barker-code-challenge.appspot.com",
    messagingSenderId: "448697502030",
    appId: "1:448697502030:web:a2a66a23acf55b4587b61f"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
