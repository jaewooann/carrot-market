import Layout from "@/components/layout";
import Message from "@/components/message";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import type { ChatMessage, ChatRoom, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface ChatRoomWithChatMessagesAndProduct extends ChatRoom {
  chatMessages: [
    {
      message: string;
      createdAt: string;
      userId: number;
    }
  ];
  product: {
    name: string;
  };
  host: User;
  invited: User;
}

interface ChatRoomResponse {
  ok: boolean;
  chatRoom: ChatRoomWithChatMessagesAndProduct;
}

interface ChatMessageResponse {
  ok: boolean;
  chatMessage: ChatMessage;
}

interface MessageForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [onToggle, setOnToggle] = useState(false);
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<ChatRoomResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );
  const [sendMessage, { data: sendMessageData, loading }] =
    useMutation<ChatMessageResponse>(`/api/chats/${router.query.id}/messages`);
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    void mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chatRoom: {
            ...prev.chatRoom,
            chatMessages: [
              ...prev.chatRoom.chatMessages,
              {
                message: form.message,
                createdAt: Date.now(),
                userId: user?.id,
              },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };

  const onClickReserToggle = () => {
    setOnToggle((prev) => !prev);
  };

  const onClickGoToReview = () => {
    void router.push(
      `/review?createdById=${data?.chatRoom.hostId}&createdForId=${data?.chatRoom.invitedId}`
    );
  };

  return (
    <Layout
      title={String(data?.chatRoom.product.name)}
      canGoBack
      seoTitle="Chats Detail"
    >
      <div className="border-y-[1px]">
        {onToggle ? (
          <>
            <button
              onClick={onClickReserToggle}
              className="inline-block my-5 p-2 rounded-md bg-red-500 text-white cursor-pointer hover:bg-red-600 text-sm"
            >
              예약취소
            </button>
            <button
              onClick={onClickGoToReview}
              className="inline-block ml-2 my-5 p-2 rounded-md bg-orange-500 text-white cursor-pointer hover:bg-orange-600 text-sm"
            >
              리뷰작성
            </button>
          </>
        ) : (
          <button
            onClick={onClickReserToggle}
            className="inline-block my-5 p-2 rounded-md bg-green-500 text-white cursor-pointer hover:bg-green-600 text-sm"
          >
            예약하기
          </button>
        )}
      </div>
      <div className="py-10 px-4 space-y-4">
        {data?.chatRoom?.chatMessages?.map((chatMessage) => (
          <Message
            key={chatMessage?.createdAt}
            message={chatMessage?.message}
            reversed={chatMessage?.userId === user?.id}
            avatarUrl={
              chatMessage.userId === data.chatRoom.hostId
                ? data.chatRoom.host.avatar
                : data.chatRoom.invited.avatar
            }
          />
        ))}
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed w-full mx-auto max-w-md bottom-2 inset-x-0"
        >
          <div className="flex relative items-center">
            <input
              {...register("message", { minLength: 1 })}
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 pr-12 focus:outline-none focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 text-sm text-white hover:bg-orange-600">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
