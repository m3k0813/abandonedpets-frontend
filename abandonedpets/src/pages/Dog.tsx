import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Search from '../components/pets/Search';
import DogList from '../components/pets/DogList';

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

function Dog() {
  const [searchParams, setSearchParams] = useState<any>({});

  const searchHandler = (params: SearchParams) => {
    setSearchParams(params);
  };

  return (
    <>
      <NavBar />
      <Search onSearch={searchHandler} />
      <DogList searchParams={searchParams} />
      <Footer />
    </>
  );
}

export default Dog;
