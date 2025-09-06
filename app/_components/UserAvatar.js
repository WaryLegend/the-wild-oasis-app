import Image from "next/image";
import { auth } from "../_lib/auth";

async function UserAvatar() {
  const session = await auth();

  if (!session) return;

  return (
    <Image
      src={session?.user?.image}
      className="rounded-full"
      alt={`avatar of ${session?.user?.name}`}
      width={30}
      height={30}
      referrerPolicy="no-referrer"
    />
  );
}

export default UserAvatar;
