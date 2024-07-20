import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Search from '../components/pets/Search';
import CatList from '../components/pets/CatList';

interface SearchParams {
  categories: string | null;
  status: string | null;
  minAge: string | null;
  maxAge: string | null;
  title: string | null;
  isYoung: boolean | null;
  page: number | null;
  size: number | null;
}

function Cat() {
  const [searchParams, setSearchParams] = useState<any>({});

  const searchHandler = (params: SearchParams) => {
    setSearchParams(params);
  };
  return (
    <>
      <NavBar />
      <Search onSearch={searchHandler} />
      <CatList searchParams={searchParams} />
      <Footer />
    </>
  );
}

export default Cat;
