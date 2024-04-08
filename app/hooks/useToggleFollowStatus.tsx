import { useState } from "react";
import axios from "axios";

const useToggleFollowStatus = () => {
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [currentFollowing, setCurrentFollowing] = useState(false);

  const toggleFollowStatus = async (
    action: "follow" | "unfollow",
    username: string | undefined
  ) => {
    try {
      setIsFollowLoading(true);
      const method = action === "follow" ? "post" : "delete";
      if (typeof username !== "undefined") {
        const response = await axios[method](
          `/api/profiles/${username}/follow`
        );
        if (response.status === 200) {
          setCurrentFollowing(!response.data.following);
        }
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  return { isFollowLoading, currentFollowing, toggleFollowStatus };
};

export default useToggleFollowStatus;
