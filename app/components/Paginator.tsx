"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  totalPages: number | undefined;
  page: number;
  redirect?: string;
};

const Paginator = ({ totalPages = 1, page, redirect = "" }: Props) => {
  const router = useRouter();
  return (
    <>
      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i} className={`page-item ${page === i + 1 && "active"}`}>
            <a className="page-link" href={`${redirect}/?page=${i + 1}`}>
              {i + 1}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Paginator;
