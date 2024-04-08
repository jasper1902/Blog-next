"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import Input from "../components/input/Input";
import { SafeUser } from "@/types/user";
import { useRedirectBasedOnUserPresence } from "../hooks/useLogin";
import Link from 'next/link'

type Props = {
  currentUser: SafeUser | null;
};

const RegisterForm = ({ currentUser }: Props) => {
  const router = useRouter();

  useRedirectBasedOnUserPresence(currentUser, "/", false);

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      await axios.post("/api/register", { user: data });

      const callback = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (callback?.ok) {
        reset();
        router.push("/login");
        router.refresh();
      }

      if (callback?.error) {
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser) {
    return <></>;
  }

  return (
    <>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign up</h1>
              <p className="text-xs-center">
                <Link  href="/login">Have an account?</Link>
              </p>
              <ul className="error-messages">
                {/* <li>That email is already taken</li> */}
              </ul>

              <div>
                <fieldset className="form-group">
                  <Input
                    register={register}
                    id="username"
                    placeholder="Username"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <Input
                    register={register}
                    id="email"
                    type="email"
                    placeholder="Email"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <Input
                    register={register}
                    id="password"
                    type="password"
                    placeholder="Password"
                  />
                </fieldset>
                <button
                  disabled={isLoading}
                  className="btn btn-lg btn-primary pull-xs-right"
                  onClick={handleSubmit(onSubmit)}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
