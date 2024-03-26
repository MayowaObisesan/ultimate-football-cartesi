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
import footballImage from "/public/img/football.jpeg";
import managerImage from "/public/img/manager.png";
import { Network } from "./Network";
import Link from "next/link";

export interface IInputProps {
  dappAddress: string;
}

const GameSections = [
  {
    url: "/game-single",
    image: onePlayerImage,
    text: "1-Player Mode",
  },
  {
    url: "/game-duel",
    image: duelImage,
    text: "VS Mode",
  },
  {
    url: "/list-match",
    image: onePlayerImage,
    text: "Available Matches",
  },
  {
    url: "/players",
    image: footballPlayerImage,
    text: "Available Players",
  },
  {
    url: "/help",
    image: helpImage,
    text: "Help",
  },
  {
    url: "/about",
    image: footballImage,
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
        <header className="font-semibold text-2xl">Ultimate Football</header>
      </div>
      <section className="py-8 w-full px-4">
        <div className="font-bold text-xl text-base-content leading-normal px-0 py-3 ml-80 uppercase">
          Select your game mode
        </div>
        <div className="flex flex-col gap-4 ml-80">
          <Image
            src={managerImage.src}
            alt={"manager Image"}
            width={managerImage.width}
            height={managerImage.height}
            className={
              "absolute bottom-0 left-16 h-[600px] transition-all object-center scale-125"
            }
          />
          <div className="flex flex-row gap-4 w-full">
            <Link
              href={GameSections[0].url}
              className="group relative flex flex-col justify-center px-16 cursor-pointer w-[55%] h-[360px] bg-gradient-to-br from-gray-100/80 to-gray-300/40 text-black hover:scale-[1.02] transition-transform"
            >
              <h1 className="font-bold text-6xl leading-loose">
                {GameSections[0].text}
              </h1>
              <span className="text-xl leading-normal">
                Compete against our football AI in this action-packed 90 seconds
                mode
              </span>
            </Link>
            <Link
              href={GameSections[1].url}
              className="group relative flex flex-col justify-center px-16 cursor-pointer w-[45%] h-[360px] bg-gradient-to-br from-base-100/80 to-base-300/40 text-base-content hover:scale-[1.02] transition-transform"
            >
              <h1 className="font-bold text-6xl leading-loose">
                {GameSections[1].text}
              </h1>
              <span className="text-xl leading-normal">
                Compete against our football AI in this action-packed 90 seconds
                mode
              </span>
            </Link>
          </div>
          <div className="flex flex-row gap-4 w-full">
            <Link
              href={GameSections[2].url}
              className="group relative flex flex-col justify-center px-16 cursor-pointer w-[35%] h-[300px] bg-gradient-to-br from-blue-800/80 to-blue-600/80 text-base-content hover:scale-[1.02] transition-transform"
            >
              <h1 className="font-bold text-5xl leading-tight">
                {GameSections[2].text}
              </h1>
              <span className="text-xl leading-normal">
                Find Available matches that you can join here
              </span>
            </Link>
            <Link
              href={GameSections[3].url}
              className="group relative flex flex-col justify-center px-16 cursor-pointer w-[35%] h-[300px] bg-gradient-to-br from-amber-800/80 to-amber-600/70 text-base-content hover:scale-[1.02] transition-transform"
            >
              <h1 className="font-bold text-5xl leading-tight">
                {GameSections[3].text}
              </h1>
              <span className="text-xl leading-normal">
                Find Available matches that you can join here
              </span>
            </Link>
            <div className="group relative flex flex-row justify-center gap-x-4 cursor-pointer w-[30%] h-[300px]">
              <Link
                href={GameSections[4].url}
                className="group relative flex flex-col justify-center items-center text-center px-16 cursor-pointer w-full h-[300px] bg-gradient-to-br from-gray-100/80 to-gray-300/40 text-black hover:scale-[1.02] transition-transform"
              >
                <h1 className="font-bold text-xl leading-tight">
                  {GameSections[4].text}
                </h1>
              </Link>
              <Link
                href={GameSections[5].url}
                className="group relative flex flex-col justify-center items-center text-center px-16 cursor-pointer w-full h-[300px] bg-gradient-to-br from-base-100/80 to-base-300/40 text-base-content hover:scale-[1.02] transition-transform"
              >
                <h1 className="font-bold text-xl leading-tight">
                  {GameSections[5].text}
                </h1>
              </Link>
            </div>
          </div>

          {/* <div className="flex flex-row flex-wrap justify-start items-center w-full gap-4">
            {GameSections.map((eachGameSection, index) => (
              <Link
                key={index}
                href={eachGameSection.url}
                className="group relative bg-gradient-to-tl from-base-100 to-transparent space-y-8 cursor-pointer hover:shadow-xl rounded transition-[box-shadow,transform] hover:scale-[1.02]"
              >
                <div className="relative w-[600px] h-[360px]">
                  <Image
                    src={eachGameSection.image}
                    alt={"duel home Image"}
                    width={320}
                    height={320}
                    className={"w-full h-full transition-all object-cover"}
                  />
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-slate-200/20"></span>
                </div>
                <div className="absolute top-4 right-8 font-bold text-2xl text-success-content leading-normal text-center uppercase">
                  {eachGameSection.text}
                </div>
              </Link>
            ))}
          </div> */}
        </div>
      </section>
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
