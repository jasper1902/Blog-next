import { SafeUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRedirectBasedOnUserPresence(
  currentUser: SafeUser | null,
  redirectPath: string,
  shouldBePresent: boolean
) {
  const navigation = useRouter();
  
  useEffect(() => {
    if ((shouldBePresent && !currentUser) || (!shouldBePresent && currentUser)) {
      navigation.push(redirectPath);
    }
  }, [currentUser, redirectPath, navigation, shouldBePresent]);
}
