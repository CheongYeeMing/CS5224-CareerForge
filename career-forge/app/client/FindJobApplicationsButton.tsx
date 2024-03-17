'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const FindJobApplicationsButton = () => {
  return (
    <Link href="/login" className="">
      <Button color="primary" variant="ghost" size="lg">
        Find Jobs
      </Button>
    </Link>
  );
};

export default FindJobApplicationsButton;