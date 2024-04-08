"use client";
import { SafeUser } from "@/types/user";
import React, { useEffect, useState } from "react";
import { useRedirectBasedOnUserPresence } from "../hooks/useLogin";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../components/input/Input";
import Textarea from "../components/input/Textarea";
import { signOut } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  currentUser: SafeUser | null;
};

const SettingForm = ({ currentUser }: Props) => {
  const router = useRouter();
  useRedirectBasedOnUserPresence(currentUser, "/login", true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: currentUser?.email,
      password: "",
      username: currentUser?.username,
      bio: currentUser?.bio,
      image: currentUser?.image,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      await axios.put("/api/user", { user: data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <></>;
  }

  return (
    <>
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              {/* <ul className="error-messages">
                <li>That name is required</li>
              </ul> */}

              <div>
                <fieldset>
                  <fieldset className="form-group">
                    <Input
                      register={register}
                      placeholder="URL of profile picture"
                      id="image"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <Input
                      register={register}
                      placeholder="Your Name"
                      id="username"
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <Textarea
                      register={register}
                      placeholder="bio"
                      id="bio"
                      rows={8}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <Input register={register} placeholder="Email" id="email" />
                  </fieldset>
                  <fieldset className="form-group">
                    <Input
                      register={register}
                      placeholder="New Password"
                      id="password"
                      type="password"
                    />
                  </fieldset>
                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                  >
                    Update Settings
                  </button>
                </fieldset>
              </div>
              <hr />
              <button
                className="btn btn-outline-danger"
                onClick={() => signOut()}
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingForm;
