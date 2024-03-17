'use client';

require('dotenv').config();
import React from 'react';
import Link from 'next/link';
import NavBar from '../../components/NavBar/NavBar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Input, Button } from '@nextui-org/react';
import axios from 'axios';

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

  const handleRegister = async (e: any) => {
    console.log('register button clicked');
    setIsLoading(true);
    e.preventDefault();

    const { name, email, username, password } = formData;

    if (!name || !email || !username || !password) {
      toast.error('All fields are required!');
      return;
    }

    if (email) {
      console.log('Email verification done.');
    }

    if (username) {
      const apiKey = process.env.NEXT_PUBLIC_X_API_KEY || '';
      console.log('API KEY: ', apiKey);
      console.log(process.env);

      const requestBody = {
        name: name,
        email: email,
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
          `${process.env.NEXT_PUBLIC_USER_LAMBDA_URL}/register`,
          requestBody,
          requestConfig
        )
        .then((response) => {
          toast.success('Registration successful!');
          router.push('/login');
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.response.status === 401) {
            toast.error(
              'Invalid name, username or password. Please try again.'
            );
          } else {
            toast.error('An error occurred. Please try again.');
          }
        });
    } else {
      setIsLoading(false);
      toast.error('Invalid name, username or password. Please try again.');
    }
  };

  return (
    <section className="text-white body-font  p-4">
      <NavBar isAuthenticated={false} logoutHandler={()=>{}} />
      <div className="container px-5 pb-12 mx-auto flex flex-wrap items-center">
        <div className="lg:w-2/6 md:w-1/2 bg-transparent rounded-lg p-8 flex flex-col md:mx-auto w-full mt-10 md:mt-0">
          <h2 className="text-white text-lg font-medium title-font mb-5">
            Sign Up
          </h2>
          <div className="relative mb-4">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <Input
              type="string"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="relative mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <Input
              type="string"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="relative mb-4">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <Input
              type="username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="relative mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button
            color="primary"
            variant="ghost"
            onClick={handleRegister}
            isLoading={isLoading}
          >
            {isLoading ? 'Registering ...' : 'Register'}
          </Button>
          <Link
            className="link link-primary mt-2 text-blue-200 hover:text-blue-400"
            href="/login"
          >
            I have already created an account!
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
