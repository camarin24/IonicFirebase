import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireUser } from 'angularfire2/user';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: FirebaseListObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,private db:AngularFireDatabase) {
      this.items = db.list('/Users');
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
