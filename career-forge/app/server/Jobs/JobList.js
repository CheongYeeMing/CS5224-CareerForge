import React from 'react';
import JobItem from './JobItem';
import { ScrollShadow } from '@nextui-org/react';
import './JobList.css';

const JobList = (props) => {
  let content;
  console.log(props);
  if (!props.jobRecommendations || props.jobRecommendations.length === 0) {
    content = <p>Nothing</p>;
  } else {
    content = (
      <ul className="job-list">
        {props.jobRecommendations.map((p) => (
          <JobItem
            id={p[0]}
            company={p[1]}
            title={p[2]}
            level={p[3]}
            description={p[4]}
            keywords={p[5]}
          />
        ))}
      </ul>
    );
  }

  return (
    <section id="jobs">
      <ScrollShadow
        size={75}
        hideScrollBar
        className="w-100 h-full overflow-y-auto"
      >
        {content}
      </ScrollShadow>
    </section>
  );
};

export default JobList;
