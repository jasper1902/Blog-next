import Image from "next/image";
import Tags from "./components/Tags";
import ArticlesContainer from "./components/articles/ArticlesContainer";
import { getGlobalFeed } from "@/actions/getArticles";
import Paginator from "./components/Paginator";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const articles = await getGlobalFeed(5, page);
  return (
    <>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <Link className="nav-link" href="">
                      Your Feed
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" href="">
                      Global Feed
                    </Link>
                  </li>
                </ul>
              </div>

              <ArticlesContainer articles={articles?.article} />
              <Paginator totalPages={articles?.totalPages} page={page} />
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <div className="tag-list">
                  <Tags />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
