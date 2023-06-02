import withHandler from "@/libs/server/withHandler";
import type { ResponseType } from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      query: { productId, invitedId },
      session: { user },
    } = req;
    if (invitedId === String(user?.id)) return;
    const alreadyExists = await client.chatRoom.findFirst({
      where: {
        productId: Number(productId?.toString()),
        hostId: user?.id,
        invitedId: Number(invitedId?.toString()),
      },
    });
    if (alreadyExists) {
      res.json({ ok: true, chatRoomId: alreadyExists.id });
    } else {
      const newChatRoom = await client.chatRoom.create({
        data: {
          product: {
            connect: {
              id: Number(productId?.toString()),
            },
          },
          host: {
            connect: {
              id: user?.id,
            },
          },
          invited: {
            connect: {
              id: Number(invitedId?.toString()),
            },
          },
        },
      });
      console.log(newChatRoom);
      res.json({
        ok: true,
        chatRoomId: newChatRoom.id,
      });
    }
  }
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    const chatRooms = await client.chatRoom.findMany({
      where: {
        OR: [
          {
            hostId: user?.id,
          },
          {
            invitedId: user?.id,
          },
        ],
      },
      include: {
        chatMessages: {
          select: {
            message: true,
            createdAt: true,
            user: true,
          },
        },
        host: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        invited: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.json({
      ok: true,
      chatRooms,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
