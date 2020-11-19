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
    public replies?: iTweetReply[] = [];
    public isRetweet?: boolean;
    public user?: iUser;


    // public retweet?: iRetweet = new iRetweet();

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
    public replyImage: string;
    public replyText: string;
    public uid: string;
    public timestamp: number;
}

