import FloatingButton from "@/components/floating-button";
import Layout from "@/components/layout";
import Pagination from "@/components/pagination";
import type { Stream } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useSWR<StreamsResponse>(`/api/streams`);
  const { data: limitData } = useSWR<StreamsResponse>(
    `/api/streams?page=${currentPage}`
  );

  const totalCount = data?.streams?.length!;

  return (
    <Layout title="라이브" hasTabBar>
      <div className="py-10 divide-y-2 space-y-4">
        {limitData?.streams?.map((stream) => (
          <Link href={`/streams/${stream.id}`} key={stream.id}>
            <div className="pt-4 px-4">
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              <h3 className="text-gray-700 font-bold text-xl mt-2">
                {stream.id}
              </h3>
            </div>
          </Link>
        ))}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Streams;
