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
    // public replies?: iTweetReply[] = [];
    public isRetweet?: boolean;
    // public retweet?: iRetweet = new iRetweet();

}

// export class iRetweet {
//     public retweetUser: User;
//     public retweetData: iTweet = new iTweet();
// }

// export class iTweetReply {
//     public replyUser: User;
//     public replyData: iTweet = new iTweet();
// }

