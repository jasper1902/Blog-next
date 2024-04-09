"use client";
import { ArticleResponse, SafeUser, UserResponse } from "@/types/user";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ArticlesContainer from "@/app/components/articles/ArticlesContainer";
import Image from "next/image";
import { defaultImage } from "@/utils/mapper";
import Paginator from "@/app/components/Pagination";
import useToggleFollowStatus from "@/app/hooks/useToggleFollowStatus";
import useProfile from "@/app/hooks/useProfile";

type Props = {
  currentUser: SafeUser | null;
  page: number;
  tab: string;
};

const ProfilePage = ({ currentUser, page, tab = "true" }: Props) => {
  const params = useParams<{ username: string; tab: string }>();
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleResponse[]>();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isTapbarMyArticles, setIsTapbarMyArticles] = useState<boolean>(true);
  const [following, setFollowing] = useState<boolean | null | undefined>(null);
  const { isFollowLoading, currentFollowing, toggleFollowStatus } =
    useToggleFollowStatus();
  const { profile, getProfile } = useProfile();
  useEffect(() => {
    if (params?.username) {
      fetchProfileAndArticles(params?.username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isTapbarMyArticles]);

  useEffect(() => {
    setFollowing(user?.following);
  }, [user]);

  useEffect(() => {
    setFollowing(currentFollowing);
  }, [currentFollowing]);

  useEffect(() => {
    setUser(profile);
  }, [profile]);

  useEffect(() => {
    setIsTapbarMyArticles(tab === "true");
  }, [tab]);

  const fetchProfileAndArticles = async (username: string) => {
    try {
      await getProfile(username);
      if (isTapbarMyArticles) {
        await fetchArticlesByUser(username, page);
      } else {
        await fetchArticlesByFavorited(username, page);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchArticlesByUser = async (username: string, page: number) => {
    try {
      const response = await axios.get(
        `/api/articles?author=${username}&limit=5&page=${page}`
      );
      if (response.status === 200) {
        setArticles(response.data.article);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchArticlesByFavorited = async (username: string, page: number) => {
    try {
      const response = await axios.get(
        `/api/articles?favorited=${username}&limit=5&page=${page}`
      );
      if (response.status === 200) {
        setArticles(response.data.article);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleFollow = () => {
    following
      ? toggleFollowStatus("unfollow", params?.username)
      : toggleFollowStatus("follow", params?.username);
  };
  
  return (
    <>
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <Image
                  src={user?.image || defaultImage}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="user-img"
                />
                <h4>{user?.username}</h4>
                <p>{user?.bio}</p>
                {currentUser?.username === params?.username ? (
                  <>
                    <button
                      className="btn btn-sm btn-outline-secondary action-btn"
                      onClick={() => {
                        router.push("/settings");
                      }}
                    >
                      <i className="ion-gear-a"></i>
                      &nbsp; Edit Profile Settings
                    </button>
                  </>
                ) : (
                  currentUser && (
                    <>
                      <button
                        disabled={isFollowLoading}
                        className="btn btn-sm btn-outline-secondary action-btn"
                        onClick={handleToggleFollow}
                      >
                        <i className="ion-plus-round"></i>
                        &nbsp; {following ? "unfollow" : "follow"}{" "}
                        {user?.username}
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li
                    className="nav-item"
                    onClick={() => setIsTapbarMyArticles(true)}
                  >
                    <div
                      className={`nav-link cursor-pointer ${
                        isTapbarMyArticles && "active"
                      }`}
                    >
                      My Articles
                    </div>
                  </li>
                  <li
                    className="nav-item"
                    onClick={() => setIsTapbarMyArticles(false)}
                  >
                    <div
                      className={`nav-link cursor-pointer ${
                        !isTapbarMyArticles && "active"
                      }`}
                    >
                      Favorited Articles
                    </div>
                  </li>
                </ul>
              </div>

              <ArticlesContainer
                articles={articles}
                currentUser={currentUser}
              />

              <Paginator
                totalPages={totalPages}
                page={page}
                redirect={`/profile/${params?.username}`}
                query={`&tab=${isTapbarMyArticles}`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
