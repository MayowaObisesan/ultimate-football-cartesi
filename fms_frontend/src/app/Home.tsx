"use client";

import { Post } from "./components/Posts";
import PostForm from "./components/PostForm";
import { useState } from "react";
import Image from "next/image";
import duelImage from "/public/img/duel.jpeg";
import onePlayerImage from "/public/img/onePlayer.jpeg";
import footballPlayerImage from "/public/img/footballPlayer.jpeg";
import helpImage from "/public/img/help.jpeg";
import fileImage from "/public/img/file.png";
import { Network } from "./Network";
import Link from "next/link";

export interface IInputProps {
  dappAddress: string;
}

const GameSections = [
  {
    url: "/game-duel",
    image: duelImage,
    text: "VS Mode",
  },
  {
    url: "/game-single",
    image: onePlayerImage,
    text: "1-Player Mode",
  },
  {
    url: "/players",
    image: footballPlayerImage,
    text: "Players",
  },
  {
    url: "/help",
    image: helpImage,
    text: "Help",
  },
  {
    url: "/about",
    image: fileImage,
    text: "About Game",
  },
];

export const Home = () => {
  const [dappAddress, setDappAddress] = useState<string>(
    "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
  );
  return (
    // <section className={"grid grid-cols-12 py-8"}>
    //   <section className={"col-span-3"}>
    //     <UserLeft />
    //   </section>
    //   <section className={"col-span-6 px-4"}>
    //     <PostForm />
    //     <div
    //       className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}
    //     >
    //       Posts
    //     </div>
    //     <Post />
    //   </section> dappAddress={dappAddress}
    //   <section className={"col-span-3"}>
    //     <RightComponent />
    //   </section>
    // </section>
    <div className="home-container w-full h-dvh flex flex-col justify-start items-center">
      <div className="self-start w-full text-left p-8">
        <header className="font-medium text-2xl">
          Welcome to Ultimate Football
        </header>
        <div className="font-bold text-5xl text-green-600 leading-normal">
          Select your game mode
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center items-center gap-x-4 py-24">
        {GameSections.map((eachGameSection, index) => (
          <Link
            key={index}
            href={eachGameSection.url}
            className="group bg-base-100/60 space-y-8 cursor-pointer hover:shadow-xl rounded-box p-4 transition-[box-shadow]"
          >
            <Image
              src={eachGameSection.image}
              alt={"duel home Image"}
              width={320}
              height={320}
              className={
                "h-[360px] rounded-md group-hover:scale-110 transition-[transform]"
              }
            />
            <div className="font-semibold text-2xl text-base-content leading-normal text-center">
              {eachGameSection.text}
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute top-8 right-4">
        <Network />
      </div>
      {/* <PostForm dappAddress={dappAddress} />
      <div className={"prose text-4xl font-bold text-gray-400 px-2 py-6 mt-8"}>
        Posts
      </div>
      <Post /> */}
    </div>
  );
};
