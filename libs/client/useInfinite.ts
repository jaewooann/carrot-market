import { useEffect, useState } from "react";

export default function useInfiniteScroll() {
  const [page, setPage] = useState(1);

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return page;
}
