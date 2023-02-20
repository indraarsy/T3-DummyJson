import { useRouter } from "next/router";
import * as React from "react";

const Admin: React.FunctionComponent = (props) => {
  const router = useRouter();

  React.useEffect(() => {
    void router.push("/admin/products");
  }, [router]);

  return <></>;
};

export default Admin;
