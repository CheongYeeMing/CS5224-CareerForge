import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Modal,
  Textarea,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import axios from 'axios';
import {
  ChevronDown,
  Lock,
  Activity,
  Flash,
  Server,
  TagUser,
  Scale,
} from './Icons.jsx';
import { AcmeLogo } from './AcmeLogo.jsx';

interface NavBarProps {
  isAuthenticated: boolean;
  logoutHandler: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated, logoutHandler }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null); // State to store the selected file
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]); // Set the first accepted file
    },
  });

  const readFileAsBinary = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryData = reader.result as ArrayBuffer;
        resolve(binaryData);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadResume = async () => {
    setIsLoading(true);
    if (selectedFile) {
      const apiKey = process.env.NEXT_PUBLIC_X_API_KEY || '';
      let username = '123';
      const user = sessionStorage.getItem('user');
      if (user) {
        username = JSON.parse(user)['username'];
        console.log(username);
      }
      const binaryData: any = await readFileAsBinary(selectedFile);
      const requestConfig = {
        headers: {
          'Content-Type': 'application/pdf',
          'x-api-key': apiKey,
          user_id: username,
        },
      };
      axios
        .post(
          `${process.env.NEXT_PUBLIC_USER_LAMBDA_URL}/upload-resume`,
          binaryData,
          requestConfig
        )
        .then((response) => {
          setIsLoading(false);
          onClose();
          toast.success('Resume uploaded successfully!');
          setSelectedFile(null); // Reset selected file state
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          onClose();
          if (
            error.response.statusCode === 401 ||
            error.response.statusCode === 403
          ) {
            toast.error('Unable to upload resume. Please try again.');
          } else {
            toast.error('Something went wrong. Please try again later.');
          }
        });
    } else {
      setIsLoading(false);
      toast.error('Please select a file to upload');
    }
  };

  return (
    <Navbar>
      <NavbarBrand>
        <Link href={isAuthenticated ? '/dashboard' : '/home'}>
          <AcmeLogo />
          <p className="font-bold text-inherit text-white">Career Forge</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {isAuthenticated && (
          <>
            <NavbarItem isActive>
              <Link href="#" aria-current="page">
                Job Listings
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button onPress={onOpen} variant="ghost">
                Upload Resume
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        {!isAuthenticated && (
          <>
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
        {isAuthenticated && (
          <NavbarItem className="hidden lg:flex">
            <Button color="primary" variant="flat" onClick={logoutHandler}>
              Logout
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Resume
              </ModalHeader>
              <ModalBody>
                {selectedFile ? (
                  <p>Selected file: {selectedFile.name}</p> // Display file name if selected
                ) : (
                  <p className="dropzone" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Textarea
                      isReadOnly
                      variant="bordered"
                      placeholder="Drag & drop resume here, or click to select resume"
                      defaultValue="Drag & drop resume here, or click to select resume"
                      className="max-w-full"
                    ></Textarea>
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={uploadResume}
                  isLoading={isLoading}
                >
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Navbar>
  );
};

export default NavBar;
