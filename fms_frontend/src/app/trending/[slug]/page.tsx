"use client";

import { TrendingUp } from "lucide-react";
import { EmptyPage } from "../../components/EmptyPage";
import {
  PostActions,
  PostBody,
  PostContainer,
  PostUser,
} from "../../components/Posts";
import { usePeepsContext } from "../../context";

const TrendingPosts = ({ params }: { params: { slug: string } }) => {
  const { notices, wallet } = usePeepsContext();

  if (!notices)
    return (
      <EmptyPage
        icon={<TrendingUp size={48} />}
        text={"No trending posts..."}
      ></EmptyPage>
    );
  if (notices?.length < 1)
    return (
      <EmptyPage
        icon={<TrendingUp size={48} />}
        text={"Nothing is trending at the moment"}
      ></EmptyPage>
    );

  console.log(params);

  return (
    <section>
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Trending Posts
      </div>
      {/* {console.log(currentAddress)}
          {console.log(JSON.parse(notices.reverse()[0].payload).posts)}
          {console.log(
            JSON.parse(notices.reverse()[0].payload).posts.filter(
              (it: any) => it.address === currentAddress
            )
          )} */}
      {console.log(JSON.parse(notices?.reverse()[0].payload))}
      {notices.length > 0 &&
        JSON.parse(notices?.reverse()[0].payload)
          .posts?.filter((item: any) =>
            item.content?.message?.includes(params.slug)
          )
          .map((eachNotice: any) => (
            // .filter((it: any) => it.address === baseDappAddress)
            // .filter((it) => JSON.parse(it.payload).posts.length > 0)
            <>
              <PostContainer key={eachNotice}>
                {/* {console.log(eachNotice)} */}
                {/* {console.log(wallet?.accounts[0])} */}
                <PostUser {...eachNotice} />
                <PostBody>{eachNotice?.content?.message}</PostBody>
                <PostActions
                  postId={eachNotice.id}
                  message={eachNotice?.content.message}
                  upload={""}
                  postData={eachNotice}
                />
              </PostContainer>
              {/* <div className="divider"></div> */}
            </>
          ))}
    </section>
  );
};

export default TrendingPosts;
