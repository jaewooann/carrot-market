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
      const streams = await client.stream.findMany({
        take: 20,
        skip: 20 * (+page! - 1),
      });
      res.json({ ok: true, streams });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
