import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { TwitterService } from 'ng2-twitter';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TwitterProvider {
  
  token: null;
  tokenSecret: null;
  consumerKey = 'iA6KfiZAF9PvdySU1B5kvpgYa';
  consumerSecret = '2EOlOn4DZWmhlp7h76ct2M3rzVaQFvTrGBW08K6vS7EnXLWN2b';

  constructor(
    public tw: TwitterConnect,
    public twitter: TwitterService) {
      console.log(localStorage.getItem('twitter_token'));
      console.log(localStorage.getItem('twitter_tokenSecret'));
  }
  
  postTweet(text) {
    return this.twitter.post(
      'https://api.twitter.com/1.1/statuses/update.json',
      {
        status: text
      },
      {
        consumerKey: this.consumerKey,
        consumerSecret: this.consumerSecret
      },
      {
        token: localStorage.getItem('twitter_token'),
        tokenSecret: localStorage.getItem('twitter_tokenSecret')
      }
    )
      .map(res => res.json());
  }


  getHomeTimeline() {
    return this.twitter.get(
      'https://api.twitter.com/1.1/statuses/home_timeline.json',
      {
        count: 10
      },
      {
        consumerKey: this.consumerKey,
        consumerSecret: this.consumerSecret
      },
      {
        token: localStorage.getItem('twitter_token'),
        tokenSecret: localStorage.getItem('twitter_tokenSecret')
      }
    )
      .map(res => res.json());
  };
}
