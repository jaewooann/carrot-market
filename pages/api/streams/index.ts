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
    session: { user },
    body: { name, price, description },
    query: { page },
  } = req;
  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ ok: true, stream });
  }
  if (req.method === "GET") {
    if (!req.query.page) {
      const streams = await client.stream.findMany({});
      res.json({ ok: true, streams });
    } else {
      const allStreamList = await client.stream.findMany({
        orderBy: {
          id: "asc",
        },
      });
      const streamCount = Math.ceil(allStreamList.length / 10);

      const streams = await client.stream.findMany({
        take: 10,
        skip: (Number(page) - 1) * 10,
      });
      res.json({ ok: true, streams, streamCount });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
