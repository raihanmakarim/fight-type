import Pusher from 'pusher-js';
import process from "process";

export default async function handler( req, res ) {
  // see https://pusher.com/docs/channels/server_api/authenticating-users
  const {
    socket_id, channel_name, username,  
  } = req.body;

  // use JWTs here to authenticate users before continuing

  const randomString = Math.random().toString(36).slice(2);

  const presenceData = {
    user_id: randomString,
    user_info: { username: "@" + username, },
  };

  try {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      userAuthentication: {
        endpoint: "/pusher/user-auth",
        transport: "ajax",
        params: {
          socket_id, channel_name, presenceData 
        },
        headers: {},
        paramsProvider: null,
        headersProvider: null,
        customHandler: null,
      },
    });
    
    res.send(pusher);    
  }
  catch (error) {
    console.error(error)
  }
  
}