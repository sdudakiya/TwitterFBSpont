import { TwitterConnect } from '@ionic-native/twitter-connect';
import { TwitterProvider } from './../../providers/twitter/twitter';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
//import { InAppBrowser } from '@ionic-native/in-app-browser';


@IonicPage()
@Component({
  selector: 'page-twitter',
  templateUrl: 'twitter.html',
})

export class TwitterPage {
  loading: Loading;
  userData: any [];
  tweets: Observable<any[]>;
  isLoggedIn: boolean = false;

  constructor(public navCtrl: NavController, 
    private twitter: TwitterConnect, 
    private twitterProvider: TwitterProvider, 
    private alertCtrl: AlertController, 
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController 
  //  ,private iab: InAppBrowser
    ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TwitterPage');
    if(!localStorage.getItem("twitter_token")) {
      console.log('Twitter login required');
      this.isLoggedIn = false;
    }
    else {
      console.log('Twitter login taken from token');
      this.isLoggedIn = true;
      this.loadTimeline();
    }
  }

  public loginWithTwitter() {
      this.showLoading();
      this.twitter.login().then((data) => {
      this.setTokens(data.token, data.secret);
      this.loading.dismiss().then(() => {
        this.loadTimeline();
      });
    }, error => {
      this.showError(error);
    });
  }
  
  private showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
 
  private showError(text) {
    this.loading.dismiss().then(() => {
      let alert = this.alertCtrl.create({
        title: 'Fail',
        message: text + '\nMake sure to setup Twitter account on your device.',
        buttons: ['OK']
      });
      alert.present();
    });
  }
  
  setTokens(twitterToken, twitterTokenSecret) {
    console.log(twitterToken);
    localStorage.setItem('twitter_token', twitterToken);
    console.log(twitterTokenSecret);
    localStorage.setItem('twitter_tokenSecret', twitterTokenSecret);
  }

  // Load Timeline
  public loadTimeline(refresher?) {
    this.showLoading();
    this.tweets = this.twitterProvider.getHomeTimeline();
    this.tweets.subscribe(data => {
      this.loading.dismiss();
      refresher.complete();
    }, err => {
      refresher.complete();
      this.showError('Tokenizer failed');
    });
  }

  public composeTweet() {
    let prompt = this.alertCtrl.create({
      title: 'New Tweet',
      message: "Write your Tweet message below",
      inputs: [
        {
          name: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Tweet',
          handler: data => {
            this.postTweet(data.text);
          }
        }
      ]
    });
    prompt.present();
  }

  public dateForTweet(dateString) {
    let d = new Date(Date.parse(dateString));
 
    // http://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
 
    return datestring;
  }
 
  public openLinkUrl(url) {
    // let browser = this.iab.create(url, 'blank');
  }
 
  public postTweet(text) {
    this.showLoading();
    this.twitterProvider.postTweet(text).subscribe(res => {
      this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Tweet posted!',
        duration: 3000
      });
      toast.present();
    }, err => {
      this.showError(err);
    });
  }

  doRefresh(refresher) {
    this.tweets = this.twitterProvider.getHomeTimeline();
    this.tweets.subscribe(data => {
      this.loading.dismiss();
      refresher.complete();
    }, err => {
      refresher.complete();
      this.showError('Tokenizer failed');
    });
  }

  twitter_Logout(){
    this.twitter.logout().then((data) => {
      localStorage.removeItem('twitter_token');
      this.isLoggedIn = false;
    });
  }
}
