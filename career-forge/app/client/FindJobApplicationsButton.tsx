'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

interface FindJobApplicationsButtonProps {
  isLoading: boolean | undefined;
  onClick: () => void;
}

const FindJobApplicationsButton: React.FC<FindJobApplicationsButtonProps> = ({
  isLoading,
  onClick,
}) => {
  return (
    <Button
      color="primary"
      variant="ghost"
      size="lg"
      isLoading={isLoading}
      onClick={onClick}
    >
      Find Jobs
    </Button>
  );
};

export default FindJobApplicationsButton;
