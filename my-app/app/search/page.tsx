import SearchBox from "@/components/SearchBox";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";

export default function Search() {
  return (
    <div>
      <SignOutButton />
      <Link href="/">My list</Link>
      <SearchBox />
    </div>
  );
}
