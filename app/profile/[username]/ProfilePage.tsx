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
  currentPage: number;
  currentTab: string;
};

const ProfilePage = ({
  currentUser,
  currentPage,
  currentTab = "true",
}: Props) => {
  const params = useParams<{ username: string; tab: string }>();
  const router = useRouter();
  const [userArticles, setUserArticles] = useState<ArticleResponse[]>([]);
  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [totalArticlePages, setTotalArticlePages] = useState(0);
  const [isTabMyArticles, setIsTabMyArticles] = useState(true);
  const [isFollowingUser, setIsFollowingUser] = useState<
    boolean | null | undefined
  >(null);
  const { isFollowLoading, currentFollowing, toggleFollowStatus } =
    useToggleFollowStatus();
  const { profile, getProfile } = useProfile();

  useEffect(() => {
    if (params?.username) {
      fetchUserDataAndArticles(params.username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.username, currentPage, isTabMyArticles]);

  useEffect(() => {
    if (profile) {
      setUserProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    setIsFollowingUser(userProfile?.following);
  }, [userProfile]);

  useEffect(() => {
    if (currentFollowing !== undefined) {
      setIsFollowingUser(currentFollowing);
    }
  }, [currentFollowing]);

  useEffect(() => {
    setIsTabMyArticles(currentTab === "true");
  }, [currentTab]);

  useEffect(() => {
    if (currentPage > totalArticlePages) {
      router.push(
        `/profile/${params?.username}?page=${1}&tab=${currentTab}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    totalArticlePages,
    params?.username,
    router,
    currentTab,
  ]);

  const fetchUserDataAndArticles = async (username: string) => {
    try {
      await getProfile(username);
      await fetchUserArticles(username, currentPage);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserArticles = async (username: string, page: number) => {
    try {
      const response = await axios.get(
        `/api/articles?${
          isTabMyArticles ? `author=${username}` : `favorited=${username}`
        }&limit=5&page=${page}`
      );
      if (response.status === 200) {
        setUserArticles(response.data.article);
        setTotalArticlePages(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFollowUserAction = () => {
    toggleFollowStatus(
      isFollowingUser ? "unfollow" : "follow",
      params?.username
    );
  };

  return (
    <>
      {userProfile && (
        <div className="profile-page">
          <div className="user-info">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1">
                  <Image
                    src={userProfile.image || defaultImage}
                    alt="avatar"
                    width={100}
                    height={100}
                    className="user-img"
                  />
                  <h4>{userProfile.username}</h4>
                  <p>{userProfile.bio}</p>
                  {currentUser?.username === params?.username ? (
                    <button
                      className="btn btn-sm btn-outline-secondary action-btn"
                      onClick={() => router.push("/settings")}
                    >
                      <i className="ion-gear-a"></i>&nbsp; Edit Profile Settings
                    </button>
                  ) : (
                    currentUser && (
                      <button
                        disabled={isFollowLoading}
                        className="btn btn-sm btn-outline-secondary action-btn"
                        onClick={toggleFollowUserAction}
                      >
                        <i className="ion-plus-round"></i>&nbsp;{" "}
                        {isFollowingUser ? "unfollow" : "follow"}{" "}
                        {userProfile.username}
                      </button>
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
                      onClick={() => setIsTabMyArticles(true)}
                    >
                      <div
                        className={`nav-link cursor-pointer ${
                          isTabMyArticles && "active"
                        }`}
                      >
                        My Articles
                      </div>
                    </li>
                    <li
                      className="nav-item"
                      onClick={() => setIsTabMyArticles(false)}
                    >
                      <div
                        className={`nav-link cursor-pointer ${
                          !isTabMyArticles && "active"
                        }`}
                      >
                        Favorited Articles
                      </div>
                    </li>
                  </ul>
                </div>

                <ArticlesContainer
                  articles={userArticles}
                  currentUser={currentUser}
                />

                <Paginator
                  totalPages={totalArticlePages}
                  page={currentPage}
                  redirect={`/profile/${params?.username}`}
                  query={`&tab=${isTabMyArticles}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
