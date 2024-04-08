"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from 'next/link'

type Props = {};

const Tags = (props: Props) => {
  const [tags, setTags] = useState<string[]>();

  useEffect(() => {
    getTags();
  }, []);

  const getTags = async () => {
    try {
      const response = await axios.get("/api/tags");
      if (response.status === 200) {
        setTags(response.data.tags);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {tags?.map((tag) => (
        <Link href="" className="tag-pill tag-default" key={tag}>
          {tag}
        </Link>
      ))}
    </>
  );
};

export default Tags;
