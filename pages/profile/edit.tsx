import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditProfileForm {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: FileList;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const [avatarPreview, setAvatarPreview] = useState("");
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  useEffect(() => {
    if (user?.email) setValue("email", user.email);
    if (user?.phone) setValue("phone", user.phone);
    if (user?.name) setValue("name", user.name);
    if (user?.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/0aY6xndKFx99spTzlmzBtQ/${user?.avatar}/avatar`
      );
  }, [user, setValue]);

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", {
        message: "이메일과 폰넘버 둘 중에 하나는 입력을 하셔야합니다.",
      });
    }
    if (avatar && avatar.length > 0 && user) {
      // cf에 url요청
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      // url받으면 파일을 업로드
      const form = new FormData();
      form.append("file", avatar[0], String(user?.id));
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      // eidtProfile mutation 요청
      editProfile({
        email,
        phone,
        name,
        avatarId: id,
      });
    } else {
      editProfile({
        email,
        phone,
        name,
      });
    }
  };

  useEffect(() => {
    if (data && !data.ok && data.error) {
      return setError("formErrors", { message: data.error });
    }
  }, [data, setError]);

  const avatar = watch("avatar");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);
  return (
    <Layout canGoBack title="Edit Profile" seoTitle="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <div className="space-y-1">
          <Input
            register={register("name")}
            name="name"
            type="text"
            label="Name"
            required={false}
          />
        </div>
        <div className="space-y-1">
          <Input
            register={register("email")}
            name="email"
            type="email"
            label="Email address"
            required={false}
          />
        </div>
        <div className="space-y-1">
          <Input
            register={register("phone")}
            name="input"
            type="number"
            label="Phone number"
            kind="phone"
            required={false}
          />
        </div>
        {errors.formErrors ? (
          <span className="my-2 text-red-500 font-medium block text-center">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button text={loading ? "Loading..." : "Update profile"} large={true} />
      </form>
    </Layout>
  );
};

export default EditProfile;
