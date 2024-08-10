import ProfilePage from "./profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile description"
}
export default function ProfilePageServer() {
  return (
    <ProfilePage />
  );
}
