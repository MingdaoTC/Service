import HeaderBar from "@/components/Global/HeaderBar";
import SearchBar from "@/components/Home/SearchBar";
import JobList from "@/components/Home/JobList";

export default function Home() {
  return (
    <>
      <HeaderBar></HeaderBar>
      <SearchBar></SearchBar>
      <JobList></JobList>
    </>
  );
}
