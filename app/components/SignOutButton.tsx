"use client";
import React from "react";
import { signOut } from "next-auth/react";

type Props = {};

const SignOutButton = (props: Props) => {
  return (
    <>
      <button className="btn btn-outline-danger mx-2" onClick={() => signOut()}>
        logout.
      </button>
    </>
  );
};

export default SignOutButton;
