import withHandler from "@/libs/server/withHandler";
import type { ResponseType } from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { message },
    query: { id },
    session: { user },
  } = req;
  const chatMessage = await client.chatMessage.create({
    data: {
      message,
      user: {
        connect: {
          id: user?.id,
        },
      },
      chatRoom: {
        connect: {
          id: Number(id?.toString()),
        },
      },
    },
  });
  res.json({
    ok: true,
    chatMessage,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
