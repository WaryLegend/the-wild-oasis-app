import { auth } from "../_lib/auth";

export const metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session = await auth();

  const parts = session?.user.name?.trim().split(/\s+/) || [];
  const firstname = parts.slice(0, 2).join(" ");

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstname}
    </h2>
  );
}
