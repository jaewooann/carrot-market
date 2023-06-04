import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/libs/client/useMutation";
import type { Stream } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CreateForm {
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<CreateForm>();
  const [createStream, { data, loading }] =
    useMutation<CreateResponse>(`/api/streams`);

  const onValid = (form: CreateForm) => {
    if (loading) return;
    createStream(form);
  };

  useEffect(() => {
    if (data?.ok) {
      void router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);

  return (
    <Layout title="Go live" canGoBack seoTitle="Create Stream">
      <form onSubmit={handleSubmit(onValid)} className="py-3 px-4 space-y-5">
        <Input
          register={register("name", { required: true })}
          name="name"
          label="Name"
          type="text"
          required
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          name="price"
          label="Price"
          type="text"
          kind="price"
          required
        />
        <TextArea
          register={register("description", { required: true })}
          name="decription"
          label="Description"
          required
        />
        <Button text={loading ? "Loading..." : "Go live"} large={true} />
      </form>
    </Layout>
  );
};

export default Create;
