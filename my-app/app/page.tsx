import AuthLinks from "@/components/AuthLinks";
import SearchBox from "@/components/SearchBox";

export default async function Home() {
  return (
    <div>
      <AuthLinks />
      <SearchBox />
    </div>
  );
}
