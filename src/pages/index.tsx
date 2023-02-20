import { type NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const Home: NextPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    void router.push("/admin/dashboard");
  }, [router]);

  return <></>;
};

export default Home;
