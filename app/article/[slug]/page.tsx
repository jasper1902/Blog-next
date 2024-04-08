import React from "react";
import ArticleDetail from "./ArticleDetail";
import { getCurrentUser } from "@/actions/getCurrentUser";

type Props = {};

const page = async (props: Props) => {
  const currentUser = await getCurrentUser();
  return (
    <>
      <ArticleDetail currentUser={currentUser} />
    </>
  );
};

export default page;
