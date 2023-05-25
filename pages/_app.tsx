import UseAuth from "@/libs/client/useAuth";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { useRouter } from "next/router";
import useUser from "@/libs/client/useUser";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();
  useUser(router.pathname);

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="w-full max-w-lg mx-auto">
        <UseAuth />
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
