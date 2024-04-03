'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getUser, resetUserSession } from '../login/AuthService';
import FindJobApplicationsButton from '../client/FindJobApplicationsButton';
import JobList from '../server/Jobs/JobList';
import axios from 'axios';

const DashboardPage = () => {
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const GenerateJobRecommendations = () => {
    setIsLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_X_API_KEY || '';
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    };
    axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_LAMBDA_URL}/recommendation`,
        requestConfig
      )
      .then((response) => {
        setIsLoading(false);
        setJobRecommendations(response.data.job_details);
        toast.success('Jobs recommended successfully!');
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        if (
          error.response.statusCode === 401 ||
          error.response.statusCode === 403
        ) {
          toast.error('Unable to retreive jobs. Please try again.');
        } else {
          toast.error('Something went wrong. Please try again later.');
        }
      });
  };

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
      <div className="container mx-auto flex md:flex-row flex-col max-w-5xl ">
        <div className="ml-6 lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl mb-4 font-bold  pt-36 ">
            Welcome back,
            <br className="hidden lg:inline-block" />
            {name}!
          </h1>
          <p className="leading-relaxed text-xl">Upload your resume and</p>
          <p className="mb-8 leading-relaxed text-xl">search for jobs now~</p>
          <div className="flex justify-center">
            <FindJobApplicationsButton
              isLoading={isLoading}
              onClick={GenerateJobRecommendations}
            />
          </div>
        </div>
        <JobList jobRecommendations={jobRecommendations} />
      </div>
    </section>
  );
};

export default DashboardPage;
