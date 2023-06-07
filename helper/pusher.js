import Pusher from 'pusher'
import PusherClient from 'pusher-js'



export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: 'ap1',
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, { cluster: 'ap1', });
