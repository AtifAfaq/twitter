import { iUser } from './user';

// export class Tweet {
//     public tweetText: string;
//     public tweetUrls: string[];
//     public uid: string;
// }


export class iTweet {
    public tweetText: string;
    public tweetUrl: string;
    public timestamp: number;
    public uid: string;
    public key: string;
    public likes: Array<string> = [];
    public replies?: Array<iTweetReply> = [];
    public isRetweet?: Array<string> = [];
    public user?: iUser;
    // public originalTweet?:iTweet;


    // public retweet?: iRetweet = new iRetweet();

}


export class iRetweet {
    public tweetText: string;
    public tweetUrl: string;
    public timestamp: number;
    public uid: string;
    public key: string;
    public likes: Array<string> = [];
    public replies?: Array<iTweetReply> = [];
    public isRetweet?: Array<string> = [];
    public user?: iUser;
   public originalTweet?:iTweet;
}




// export class iReplies{
//     public image: string;
//     public replyT: string;
//     public uid: string;
//     public timestamp: number;
// }

// export class iRetweet {
//     public retweetUser: User;
//     public retweetData: iTweet = new iTweet();
// }

export class iTweetReply {
    public key: string;
    public replyImage?: string;
    public replyText: string;
    public uid: string;
    public timestamp: number;
    public user?: iUser;
    public likes?: Array<string> = [];
}

