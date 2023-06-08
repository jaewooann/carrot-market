import withHandler from "@/libs/server/withHandler";
import type { ResponseType } from "@/libs/server/withHandler";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const reviews = await client.review.findMany({
      where: {
        createdForId: user?.id,
      },
      include: {
        createdBy: { select: { id: true, name: true, avatar: true } },
      },
    });
    res.json({
      ok: true,
      reviews,
    });
  }
  if (req.method === "POST") {
    const {
      body: { score, review, createdById, createdForId },
    } = req;
    const newReview = await client.review.create({
      data: {
        review,
        score: Number(score),
        createdBy: {
          connect: {
            id: Number(createdById?.toString()),
          },
        },
        createdFor: {
          connect: {
            id: Number(createdForId?.toString()),
          },
        },
      },
    });
    res.json({
      ok: true,
      newReview,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
