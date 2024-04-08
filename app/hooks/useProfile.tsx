import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { UserResponse } from "@/types/user";

const useProfile = () => {
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async (username: string | undefined) => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<{ user: UserResponse }> = await axios.get(
        `/api/profiles/${username}`
      );
      const result = response.data.user;
      setProfile(result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data.message || "An error occurred";
        console.error("Error fetching profile:", errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, getProfile };
};

export default useProfile;
