import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from '@nextui-org/react';

const JobItem = (job) => {
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
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{job.description}</p>
      </CardBody>
      {/* <Divider/>
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/nextui-org/nextui"
        >
          Visit source code on GitHub.
        </Link>
      </CardFooter> */}
    </Card>
  );
};

export default JobItem;
