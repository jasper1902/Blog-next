import { getCurrentUser } from "@/actions/getCurrentUser";
import RegisterForm from "./RegisterForm";

type Props = {};

const page = async (props: Props) => {
  const currentUser = await getCurrentUser();

  return (
    <>
      <RegisterForm currentUser={currentUser} />
    </>
  );
};

export default page;
