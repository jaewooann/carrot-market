import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/libs/client/useMutation";
import type { Review } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ReviewForm {
  score: number;
  review: string;
}

interface ReviewResponse {
  ok: boolean;
  newReview: Review;
}

const ReviewWrite: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ReviewForm>();
  const [createReview, { data, loading }] =
    useMutation<ReviewResponse>(`/api/reviews`);

  const onValid = (form: ReviewForm) => {
    if (loading) return;
    createReview({
      ...form,
      createdById: router.query.createdById,
      createdForId: router.query.createdForId,
    });
  };
  useEffect(() => {
    if (data?.ok) {
      void router.push("/");
    }
  }, [data, router]);

  return (
    <Layout title="Write A Review" canGoBack seoTitle="Write A Review">
      <form onSubmit={handleSubmit(onValid)} className="px-4 py-4">
        <Input
          register={register("score", {
            required: true,
            pattern: /^[1-5]+$/,
            maxLength: 1,
          })}
          type="number"
          name="score"
          label="별점"
          required
        />
        <TextArea
          register={register("review")}
          name="review"
          label="후기"
          required
        />
        <Button large text="Submit" />
      </form>
    </Layout>
  );
};

export default ReviewWrite;
