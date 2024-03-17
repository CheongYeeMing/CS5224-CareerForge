'use client';

import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getUser, resetUserSession } from '../login/AuthService';
import FindJobApplicationsButton from '../client/FindJobApplicationsButton';

const DashboardPage = () => {
  const router = useRouter();
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';
  const isAuthenticated = user !== null;
  const logoutHandler = () => {
    resetUserSession();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <section className="text-white  body-font  p-4">
      <NavBar isAuthenticated={isAuthenticated} logoutHandler={logoutHandler} />
      <div className="container mx-auto flex md:flex-row flex-col items-center pt-36 max-w-5xl ">
        <div className="ml-6 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl mb-4 font-bold">
            Welcome back,
            <br className="hidden lg:inline-block" />
            {name}!
          </h1>
          <p className="leading-relaxed text-xl">Upload your resume and</p>
          <p className="mb-8 leading-relaxed text-xl">search for jobs now~</p>
          <div className="flex justify-center">
            <FindJobApplicationsButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
