import React, { Fragment } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ScrollShadow,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

const JobItem = (job) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Card className="mb-2 w-90">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{job.title}</p>
          <p className="text-small text-default-500">{job.level}</p>
        </div>
        <Button className="ml-auto" onClick={onOpen}>
          View Description
        </Button>
      </CardHeader>
      {/* <Divider />
      <CardBody className="max-h-20 overflow-hidden">
        <p>{job.description}</p>
      </CardBody> */}
      <Divider />
      <CardFooter className="flex flex-wrap gap-2">
        {job.keywords.map((keyword) => (
          <Chip color="primary" variant="bordered">
            {keyword}
          </Chip>
        ))}
      </CardFooter>
      <Fragment className="max-h-full">
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="2xl"
          style={{ maxHeight: 'calc(100% - 6rem)' }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <Image
                    alt="nextui logo"
                    height={40}
                    radius="sm"
                    src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                    width={40}
                  />
                  <div className="flex flex-col">
                    <p className="text-md">{job.title}</p>
                    <p className="text-small text-default-500">{job.level}</p>
                  </div>
                </ModalHeader>
                <ScrollShadow
                  size={75}
                  hideScrollBar
                  className="w-100 h-full overflow-y-auto"
                >
                  <ModalBody>{job.description}</ModalBody>
                </ScrollShadow>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <a
                    href={`https://www.linkedin.com/jobs/collections/recommended/?currentJobId=${job.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      color="success"
                      variant="bordered"
                      onPress={onClose}
                    >
                      Apply Now
                    </Button>
                  </a>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </Fragment>
    </Card>
  );
};

export default JobItem;
