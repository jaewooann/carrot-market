import { cls } from "@/libs/client/utils";
import type { Dispatch, MouseEvent, SetStateAction } from "react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalCount: number;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalCount,
}: PaginationProps) => {
  const pageCount = 5;
  const totalPage = Math.ceil(totalCount / 20);
  const pageGroup = Math.ceil(currentPage / pageCount);
  let lastNum = pageGroup * 5;
  if (lastNum >= totalPage) lastNum = totalPage;
  const firstNum = lastNum - (pageCount - 1);

  const onClickPrevPage = () => {
    setCurrentPage(firstNum - 1);
  };

  const onClickNextPage = () => {
    setCurrentPage(lastNum + 1);
  };

  const onClickMovePage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    setCurrentPage(+target.innerText);
  };

  return (
    <div className="flex justify-between border-red-100">
      {firstNum - 1 > 0 && <button onClick={onClickPrevPage}>이전</button>}
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          onClick={onClickMovePage}
          className={cls(
            "rounded-md py-2 px-3",
            currentPage === firstNum + i ? "bg-pink-400" : "cursor-pointer"
          )}
        >
          {firstNum + i}
        </button>
      ))}
      {lastNum < totalPage && <button onClick={onClickNextPage}>다음</button>}
    </div>
  );
};

export default Pagination;
