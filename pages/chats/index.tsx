import Layout from "@/components/layout";
import type { ChatRoom, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import useSWR from "swr";

interface ChatRoomwithChatMessages extends ChatRoom {
  chatMessages: [
    {
      message: string;
      user: User;
    }
  ];
  host: User;
  invited: User;
}

interface ChatRoomsResponse {
  ok: boolean;
  chatRooms: ChatRoomwithChatMessages[];
}

const Chats: NextPage = () => {
  const { data } = useSWR<ChatRoomsResponse>(`/api/chats`);
  return (
    <Layout hasTabBar title="채팅방" seoTitle="Chats">
      <div className="py-10 divide-y-[1px]">
        {data?.chatRooms?.map((chatRoom) => (
          <Link href={`/chats/${chatRoom.id}`} key={chatRoom.id}>
            <div className="flex cursor-pointer py-3 px-4 items-center space-x-3">
              {chatRoom?.chatMessages[chatRoom.chatMessages.length - 1]?.user
                .id === chatRoom.hostId ? (
                <img
                  src={`https://imagedelivery.net/0aY6xndKFx99spTzlmzBtQ/${chatRoom.host.avatar}/avatar`}
                  className="w-12 h-12 rounded-full bg-slate-300"
                />
              ) : (
                <img
                  src={`https://imagedelivery.net/0aY6xndKFx99spTzlmzBtQ/${chatRoom.invited.avatar}/avatar`}
                  className="w-12 h-12 rounded-full bg-slate-300"
                />
              )}
              <div>
                <p className="text-gray-700">
                  {
                    chatRoom?.chatMessages[chatRoom.chatMessages.length - 1]
                      ?.user?.name
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {
                    chatRoom?.chatMessages[chatRoom.chatMessages.length - 1]
                      ?.message
                  }
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
