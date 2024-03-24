"use client";

import { FaRetweet } from "react-icons/fa6";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useNoticesQuery } from "../generated/graphql";
import { useQuery, gql } from "@apollo/client";
import { useRollups } from "../useRollups";
import { defaultDappAddress } from "../utils/constants";
import { CommentModal } from "./commentModal";
import { EmptyPage } from "./EmptyPage";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomToastUI } from "./ToastUI";
import toast from "react-hot-toast";

type Notice = {
  id: string;
  index: number;
  input: any; //{index: number; epoch: {index: number; }
  payload: string;
};

interface IPostContainer {
  children: any;
}

interface IPostBody {
  postId: number;
  children: any;
}

interface IPostActions {
  postId: number;
  message: string;
  upload: string;
  postData: any;
  children?: any;
}

const AvatarPost = () => {
  return (
    <div className="avatar">
      <div className="w-7 rounded-full">
        <img
          src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          alt={""}
        />
      </div>
    </div>
  );
};

export const PostUser = (props: any) => {
  return (
    <section className={"flex flex-row px-2 text-sm"}>
      <div
        className={"flex-1 flex flex-row items-center gap-x-4 leading-normal"}
      >
        <AvatarPost />
        <span className="font-medium text-md relative dark:text-gray-400">
          {props?.username}
        </span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span className="relative dark:text-gray-400">@{props?.username}</span>
      </div>
      <div className={"flex-grow-0 px-6 text-gray-500"}>
        {/* {new Date().toLocaleTimeString()} */}
      </div>
    </section>
  );
};

export const PostContainer = ({ children }: IPostContainer) => {
  return (
    <section
      className={
        "card card-compact p-4 my-2 border-base-200 bg-gray-100/60 dark:bg-base-200"
      }
    >
      {children}
    </section>
  );
};

export const PostBody = ({ children, postId }: IPostBody) => {
  const router = useRouter();
  return (
    <section
      className={"px-3 py-4 text-base leading-7 text-pretty"}
      onClick={() => router.push("/comments/" + postId)}
    >
      {children}
    </section>
  );
};

export const PostActions = ({
  postId,
  message,
  upload,
  postData,
  children,
}: IPostActions) => {
  const rollups = useRollups(defaultDappAddress);
  // const [postId, setPostId] = useState();

  const addInput = async (str: string) => {
    if (rollups) {
      try {
        let payload = ethers.utils.toUtf8Bytes(str);
        // if (hexInput) {
        //   payload = ethers.utils.arrayify(str);
        // }
        return await rollups.inputContract.addInput(
          defaultDappAddress,
          payload
        );
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const handleLikePost = async () => {
    // construct the json payload to send to addInput
    const jsonPayload = JSON.stringify({
      method: "likePost",
      data: {
        id: postId,
      },
    });
    // addInput(JSON.stringify(jsonPayload));
    // console.log(JSON.stringify(jsonPayload));

    const res = await addInput(JSON.stringify(jsonPayload));
    const receipt = await res?.wait(1);
    const event = receipt?.events?.find((e) => e.event === "InputAdded");
    console.log(event);

    // toast("Transaction successful");
    if (event) {
      // toast.custom((t) => (
      //   <CustomToastUI t={t} message={"Post liked"}></CustomToastUI>
      // ));
      toast.success("Post liked");
    }
  };

  // const handleCommentPost = () => {
  //   // construct the json payload to send to addInput
  //   const jsonPayload = JSON.stringify({
  //     method: "likePost",
  //     data: {
  //       post_id: postId,
  //       message: commentMessage,
  //       upload: upload,
  //     },
  //   });
  //   addInput(JSON.stringify(jsonPayload));
  //   console.log(JSON.stringify(jsonPayload));
  // };

  return (
    <section className={"flex flex-row gap-x-6 p-2"}>
      <div
        className={
          "btn btn-ghost rounded-box flex flex-row items-center gap-x-3"
        }
        onClick={handleLikePost}
      >
        <span className="flex-shrink-0 inline-flex justify-center items-center h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 shadow-sm mx-auto dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200">
          <svg
            className="flex-shrink-0 w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
        </span>
        <span className={"text-xs"}>
          {postData?.likes.length > 0 ? postData?.likes.length : "Like"}
        </span>
      </div>

      {/* <div
        className={
          "btn btn-ghost rounded-box flex flex-row items-center gap-x-3"
        }
      >
        <span
          className="flex-shrink-0 inline-flex justify-center items-center h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 shadow-sm mx-auto dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200"
          onClick={showCommentModal}
        >
          <svg
            className="flex-shrink-0 w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
            <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
          </svg>
        </span>
        <span className={"text-xs"}>Comment</span>
      </div> */}
      <CommentModal
        postId={postId}
        message={message}
        upload={upload}
        postData={postData}
      />

      <div
        className={
          "btn btn-ghost rounded-box flex flex-row items-center gap-x-3"
        }
      >
        <span className="flex-shrink-0 inline-flex justify-center items-center h-[46px] rounded-full border-0 border-gray-200 bg-transparent text-gray-800 shadow-sm mx-auto dark:bg-slate-90 dark:border-gray-700 dark:text-gray-200">
          <FaRetweet width={24} height={24} className={"text-xl"} />
        </span>
        <span className={"text-xs"}>Repeep</span>
      </div>
    </section>
  );
};

// GraphQL query to retrieve notices given a cursor
const GET_NOTICES = gql`
  query GetNotices($cursor: String) {
    notices(first: 10, after: $cursor) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

export const Post = () => {
  // const [result, reexecuteQuery] = useNoticesQuery();
  // const { data, fetching, error } = result;
  const [cursor, setCursor] = useState(null);
  const [endCursor, setEndCursor] = useState(20);

  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    // pollInterval: 500,
  });

  // if (fetching) return <p>Loading...</p>;
  if (loading)
    return (
      <EmptyPage
        icon={<span className="loading loading-dots loading-lg"></span>}
        text={""}
      >
        <div className="text-xl">Loading...</div>
      </EmptyPage>
    );
  // if (error) return <p>Oh no... {error.message}</p>;

  if (!data || !data.notices)
    return (
      <EmptyPage
        icon={<MessageSquareText size={48} />}
        text={"No posts yet"}
      ></EmptyPage>
    );

  const notices: Notice[] = data.notices.edges
    .map((node: any) => {
      const n = node.node;
      let inputPayload = n?.input.payload;
      if (inputPayload) {
        try {
          inputPayload = ethers.utils.toUtf8String(inputPayload);
        } catch (e) {
          inputPayload = inputPayload + " (hex)";
        }
      } else {
        inputPayload = "(empty)";
      }
      let payload = n?.payload;
      if (payload) {
        try {
          payload = ethers.utils.toUtf8String(payload);
        } catch (e) {
          payload = payload + " (hex)";
        }
      } else {
        payload = "(empty)";
      }
      return {
        id: `${n?.id}`,
        index: parseInt(n?.index),
        payload: `${payload}`,
        input: n ? { index: n.input.index, payload: inputPayload } : {},
      };
    })
    .sort((b: any, a: any) => {
      if (a.input.index === b.input.index) {
        return b.index - a.index;
      } else {
        return b.input.index - a.input.index;
      }
    });

  if (notices.length < 1) {
    return (
      <EmptyPage
        icon={<MessageSquareText size={48} />}
        text={"No posts yet"}
      ></EmptyPage>
    );
  }

  return (
    <>
      {/* <button onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}>
        Reload
      </button> */}
      {/* <table>
        <thead>
          <tr>
            <th>Input Index</th>
            <th>Notice Index</th>
            <th>Input Payload</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {notices.length === 0 && (
            <tr>
              <td colSpan={4}>no notices</td>
            </tr>
          )}
          {notices.map((n: any) => (
            <tr key={`${n.input.index}-${n.index}`}>
              <td>{n.input.index}</td>
              <td>{n.index}</td>
              <td>{n.input.payload}</td>
              <td>{n.payload}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      {notices
        ? JSON.parse(notices.reverse()[0].payload)
            .posts.reverse()
            .splice(0, endCursor)
            .map((eachNotice: any) => (
              // .filter((it) => JSON.parse(it.payload).posts.length > 0)
              <>
                <PostContainer key={eachNotice}>
                  {/* {console.log(eachNotice)} */}
                  <PostUser {...eachNotice} />
                  <PostBody postId={eachNotice.id}>
                    {eachNotice?.content?.message}
                  </PostBody>
                  <PostActions
                    postId={eachNotice.id}
                    message={eachNotice?.content?.message}
                    upload={eachNotice?.content?.uplooad}
                    postData={eachNotice}
                  />
                  {/* {<PostContainer></PostContainer>} */}
                </PostContainer>
                {/* <div className="divider"></div> */}
              </>
            ))
        : null}
      <section className="flex flex-row justify-center w-full mx-auto">
        <button
          title="load more button"
          type="button"
          className="btn btn-wide block"
          onClick={() => setEndCursor((endCursor) => endCursor + 20)}
        >
          Load more
        </button>
      </section>
    </>
  );
};
