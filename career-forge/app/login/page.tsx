'use client';

import React from 'react';
import Link from 'next/link';
import NavBar from '../../components/NavBar/NavBar';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@nextui-org/react';
import { MailIcon } from './MailIcon.jsx';
import { LockIcon } from './LockIcon.jsx';
import { setUserSession } from './AuthService';
import axios from 'axios';
require('dotenv').config();

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e: any) => {
    console.log('Login button clicked');
    setIsLoading(true);
    e.preventDefault();

    const { username, password } = formData;
    if (username && password) {
      console.log('Sending Request');

      const apiKey = process.env.NEXT_PUBLIC_X_API_KEY || '';

      const requestBody = {
        username: username,
        password: password,
      };

      const requestConfig = {
        headers: {
          'x-api-key': apiKey,
        },
      };

      axios
        .post(
          `${process.env.NEXT_PUBLIC_USER_LAMBDA_URL}/login`,
          requestBody,
          requestConfig
        )
        .then((response) => {
          setUserSession(response.data.user, response.data.token);
          toast.success('Login successful');
          router.push('/dashboard');
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.response.status === 401 || error.response.status === 403) {
            toast.error('Invalid username or password. Please try again.');
          } else {
            toast.error('Something went wrong. Please try again later.');
          }
        });
    } else {
      toast.error('Invalid username or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <section className="text-white body-font p-4">
      <NavBar isAuthenticated={false}  logoutHandler={()=>{}}/>
      <div className="container px-5 pb-12 mx-auto flex flex-wrap items-center">
        <div className="lg:w-2/6 md:w-1/2 bg-transparent rounded-lg p-8 flex flex-col md:mx-auto w-full mt-10 md:mt-0">
          <h2 className="text-white text-lg font-medium title-font mb-8">
            Login
          </h2>
          <div className="relative mb-6">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <Input
              type="username"
              id="username"
              endContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative mb-6">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              endContent={
                <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            color="primary"
            variant="ghost"
            onClick={handleLogin}
            isLoading={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <Link
            className="link link-primary mt-2 text-blue-200 hover:text-blue-400"
            href="/register"
          >
            I have not created an account!
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
