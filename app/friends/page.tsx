import FriendListWithPopup from "@/components/FriendsListWithPopup";

export default function FriendsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-black">
        --- Friends ---
      </h1>
      <FriendListWithPopup />
    </div>
  );
}
