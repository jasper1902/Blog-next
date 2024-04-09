"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  totalPages: number | undefined;
  page: number;
  redirect?: string;
  query?: string
};

const Paginator = ({ totalPages = 1, page, redirect = "", query }: Props) => {
  const router = useRouter();
  return (
    <>
      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i} className={`page-item ${page === i + 1 && "active"}`}>
            <Link className="page-link" href={`${redirect}/?page=${i + 1}${typeof query === "string" && `&${query}` }`}>
              {i + 1}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Paginator;

