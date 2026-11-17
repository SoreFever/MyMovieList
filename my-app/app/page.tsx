import SearchBox from "@/components/SearchBox";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/signup">Sign up</Link>
      <Link href="/login">Login</Link>
      <SearchBox />
    </div>
  )
}
