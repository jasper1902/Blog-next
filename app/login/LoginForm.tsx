"use client";
import React, { useEffect, useState } from "react";
import Input from "../components/input/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SafeUser } from "@/types/user";
import { useRedirectBasedOnUserPresence } from "../hooks/useLogin";
import Link from 'next/link'
type Props = {
  currentUser: SafeUser | null;
};

const LoginForm = ({ currentUser }: Props) => {
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
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const callback = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      setIsLoading(false);

      if (callback?.ok) {
        reset();
        router.push("/");
        router.refresh();
      }

      if (callback?.error) {
        console.log(callback.error);
      }
    } catch (error) {
      console.log("Something went wrong");
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
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <Link href="/register">Need an account?</Link>
              </p>

              <ul className="error-messages">
                {/* <li>That email is already taken</li> */}
              </ul>

              <form>
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
                  className="btn btn-lg btn-primary pull-xs-right"
                  onClick={handleSubmit(onSubmit)}
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
