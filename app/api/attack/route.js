import Pusher from 'pusher'

import process from 'process'

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: 'ap1',
});


export const POST = async (request) => {


  try {
    const { health } = await request.json();

    console.log(health);
    await pusherServer.trigger("game-channel", "enemy-health-update", { health: health } );

    // res.status(200).json({ status: "OK" });
  }
  catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Internal server error" });
  }
}