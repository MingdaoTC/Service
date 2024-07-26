// Components
import HeaderBar from "@/components/Global/HeaderBar";
import SearchBar from "@/components/Home/SearchBar";
import JobList from "@/components/Home/JobList";
import CompanyList from "@/components/Home/CompanyList";

export default function Home() {
  return (
    <>
      <HeaderBar />
      <SearchBar />
      <JobList />
      <CompanyList />
    </>
  );
}
