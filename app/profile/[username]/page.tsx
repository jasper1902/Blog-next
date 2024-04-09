import React from "react";
import ProfilePage from "./ProfilePage";
import { getCurrentUser } from "@/actions/getCurrentUser";

const page = async ({ searchParams }: { searchParams: { page: string, tab: string } }) => {
  const currentUser = await getCurrentUser();
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  return (
    <>
      <ProfilePage currentUser={currentUser} page={page} tab={searchParams.tab} />
    </>
  );
};

export default page;
