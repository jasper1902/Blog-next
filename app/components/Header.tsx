import { getCurrentUser } from "@/actions/getCurrentUser";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

type Props = {};

const Header = async (props: Props) => {
  const currentUser = await getCurrentUser();
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right flex items-center">
          <li className="nav-item">
            <Link className="nav-link active" href="/">
              Home
            </Link>
          </li>
          {!currentUser ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/login">
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/register">
                  Sign up
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" href="/editor">
                  {" "}
                  <i className="ion-compose"></i>&nbsp;New Article{" "}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/settings">
                  {" "}
                  <i className="ion-gear-a"></i>&nbsp;Settings{" "}
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href={`/profile/${currentUser.username}`}
                >
                  <div className="flex items-center">
                    {currentUser.image && (
                      <Image
                        src={currentUser?.image}
                        className="user-pic"
                        height={30}
                        width={30}
                        alt="avatar"
                      />
                    )}
                    {currentUser.username}
                    <SignOutButton />
                  </div>
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
