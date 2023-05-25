import mail from "@sendgrid/mail";
import twilio from "twilio";
import client from "@/libs/server/client";
import withHandler from "@/libs/server/withHandler";
import type { ResponseType } from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import smtpTransport from "@/libs/server/email";

// mail.setApiKey(process.env.SENDGRID_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = String(Math.floor(100000 + Math.random() * 900000));
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    /*     const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE!,
      body: `Your login token is ${payload}`,
    });
    console.log(message); */
  }
  if (email) {
    /*     const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Nomad Carrot Authentication Email",
      text: `Authentication Code : ${payload}`,
    };
    const result = smtpTransport.sendMail(mailOptions, (error, responses) => {
      if (error) {
        console.log(error);
        return null;
      } else {
        console.log(responses);
        return null;
      }
    });
    smtpTransport.close();
    console.log(result); */
  }
  return res.json({
    ok: true,
  });
}

export default withHandler({
  methods: ["POST"],
  handler,
  isPrivate: false,
});

// else if (email) {
//   const email = await mail.send({
//     from: "wodndi0321@gmail.com",
//     to: "wodndi0321@gmail.com",
//     subject: "Your Carrot Market Verification Email",
//     text: `Your login token is ${payload}`,
//     html: `<strong>Your login token is ${payload}</strong>`,
//   });
//   console.log(email);
// }

/* if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) console.log("찾았음");
    if (!user) {
      console.log("찾지 못했으니 유저를 만들겠음");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          email,
        },
      });
    }
    console.log(user);
  }
  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone,
      },
    });
    if (user) console.log("찾았음");
    if (!user) {
      console.log("찾지 못했으니 유저를 만들겠음");
      user = await client.user.create({
        data: {
          name: "Anonymous",
          phone: +phone,
        },
      });
    }
    console.log(user);
  }
  */
