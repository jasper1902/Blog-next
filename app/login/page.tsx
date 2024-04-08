import React from "react";
import LoginForm from "./LoginForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

type Props = {};

const page = async (props: Props) => {
  const currentUser = await getCurrentUser();

  return (
    <>
      <LoginForm currentUser={currentUser} />
    </>
  );
};

export default page;
