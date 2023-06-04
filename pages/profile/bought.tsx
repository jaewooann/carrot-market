import Item from "@/components/item";
import Layout from "@/components/layout";
import ProductList from "@/components/product-list";
import type { NextPage } from "next";

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack seoTitle="Bought List">
      <div className="flex flex-col space-y-5 py-10 divide-y">
        <ProductList kind="purchases" />
      </div>
    </Layout>
  );
};

export default Bought;
