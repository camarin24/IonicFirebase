import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Observable } from 'rxjs/Observable';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireUser } from 'angularfire2/user';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AuthPage } from '../pages/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  user: Observable<firebase.User>;
  rootPage: any = HomePage;
  loguedUser:{userName:string,userEmail:string,userImage:string};
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public afAuth: AngularFireAuth,
    private database: AngularFireDatabase) {
    this.user = afAuth.authState;
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage },
      { title: 'Login', component: AuthPage }
    ];

    if (this.afAuth.authState) {
      this.user.subscribe(m => {
        this.loguedUser = {
          userName:m.displayName,
          userEmail:m.email,
          userImage:m.photoURL
        };
        this.database.list("/Users", {
          query: {
            orderByChild: 'email',
            equalTo: m.email
          }
        }).subscribe(queriedItems => {
          if (queriedItems.length <= 0) {
            this.database.list("/Users")
              .push({
                userId: m.uid,
                userName: m.displayName,
                userImage: m.photoURL,
                email: m.email
              });
          }
        });
      })
    }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
