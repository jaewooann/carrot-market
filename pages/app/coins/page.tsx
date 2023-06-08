import { Suspense } from "react";

const cache: any = {};
function fetchData(url: string) {
  if (!cache[url]) {
    throw Promise.all([
      fetch(url)
        .then((res) => res.json())
        .then((json) => (cache[url] = json)),
      new Promise((resolve) =>
        setTimeout(resolve, Math.round(Math.random() * 10005))
      ),
    ]);
  }
  return cache[url];
}

function Coin({ id, name, symbol }: any) {
  const {
    quotes: {
      USD: { price },
    },
  } = fetchData(`https://api.coinpaprika.com/vi/tickers/${id}`);
  return (
    <li>
      {name} / {symbol}: ${price}
    </li>
  );
}

function List() {
  const coins = fetchData("https://api.coinpaprika.com/v1/coins");
  return (
    <div>
      <h4>리스트 끝</h4>
      <ul>
        {coins.slice(0, 10).map((coin: any) => (
          <Coin key={coin.id} {...coin} />
        ))}
      </ul>
    </div>
  );
}

export default function Coins() {
  return (
    <div>
      <h1>Welcome to RSC</h1>
      <Suspense fallback="Rendering in the server">
        <List />
      </Suspense>
    </div>
  );
}
