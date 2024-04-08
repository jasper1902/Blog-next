import React from "react";
import SettingForm from "./SettingForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

type Props = {};

const page = async (props: Props) => {
  const currentUser = await getCurrentUser();
  return (
    <>
      <SettingForm currentUser={currentUser} />
    </>
  );
};

export default page;
