"use client";

import "./PlayerSelection.css";
import PlayerData from "../../utils/player.json";
import React, { useEffect, useRef, useState } from "react";
import { usePeepsContext } from "../../context";
import { PlayerListCard } from "../PlayerListCard/PlayerListCard";
import { useRollups } from "../../useRollups";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { defaultDappAddress } from "../../utils/constants";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { LucideX } from "lucide-react";
import { shortenPlayerNames } from "../../utils";

interface NoticesDataProps {
  noticesData: {
    match_status: number;
    home_odds: number;
    away_odds: number;
    draw_odds: number;
  };
}

export const PlayerSelection: React.FC<NoticesDataProps> = ({
  noticesData,
}) => {
  const [isPlayerListOpen, setIsPlayerListOpen] = useState(false);
  const [isGameSimulationResultPanel, setisGameSimulationResultPanel] =
    useState(false);
  const striker1 = useRef(null);
  const striker2 = useRef(null);
  const striker3 = useRef(null);
  const midfielder1 = useRef(null);
  const midfielder2 = useRef(null);
  const midfielder3 = useRef(null);
  const defender1 = useRef(null);
  const defender2 = useRef(null);
  const defender3 = useRef(null);
  const defender4 = useRef(null);
  const goalkeeper = useRef(null);
  const [currentTriggeredPlayerType, setCurrentTriggeredPlayerType] =
    useState("");
  const [currentTriggeredPlayerPosition, setCurrentTriggeredPlayerPosition] =
    useState("");
  const [selectedPlayerInfo, setSelectedPlayerInfo] = useState({
    striker1: { name: "", rating: 0 },
    striker2: { name: "", rating: 0 },
    striker3: { name: "", rating: 0 },
    midfielder1: { name: "", rating: 0 },
    midfielder2: { name: "", rating: 0 },
    midfielder3: { name: "", rating: 0 },
    defender1: { name: "", rating: 0 },
    defender2: { name: "", rating: 0 },
    defender3: { name: "", rating: 0 },
    defender4: { name: "", rating: 0 },
    goalkeeper: { name: "", rating: 0 },
  });
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<number>(0);
  //   const [selectedPlayerList, setSelectedPlayerList] = useState([]);
  const {
    baseDappAddress,
    selectedPlayerList,
    updateSelectedPlayerList,
    wallet,
  } = usePeepsContext();

  const handleTriggerSelectPlayer = (e, playerType, playerPosition) => {
    setIsPlayerListOpen(true);
    setCurrentTriggeredPlayerPosition(playerPosition);
    setCurrentTriggeredPlayerType(playerType);
  };
  const rollups = useRollups(baseDappAddress);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const profileFormCloseButton = useRef(null);

  //   useEffect(() => {
  //     setSelectedPlayerInfo(selectedPlayerInfo);
  //   }, [selectedPlayerInfo]);
  const handleSelectPlayer = (el, playerData) => {
    console.log(el);
    // el.target.
    const playerExistList = selectedPlayerList.filter(
      (it) => it.name === playerData.name
    );
    console.log(playerExistList);

    if (playerExistList.length < 1) {
      setSelectedPlayerInfo(
        (v) => (
          (selectedPlayerInfo[currentTriggeredPlayerPosition] = {
            name: playerData.name,
            rating: playerData.overall_rating,
          }),
          { ...v }
        )
      );
      setSelectedPlayerCount(selectedPlayerCount + 1);
      // updateSelectedPlayerList([
      //   selectedPlayerInfo[currentTriggeredPlayerPosition],
      //   [...selectedPlayerList],
      // ]);
      updateSelectedPlayerList({
        name: playerData.name,
        rating: playerData.overall_rating,
      });
    } else {
      alert("Player has already been selected");
    }

    // if (selectedPlayerCount === 11) {
    if (selectedPlayerList.length === 11) {
      setIsPlayerListOpen(false);
    }

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

    // const handleSimulateMatch = async () => {
    //   setIsSubmit(true);
    //   // construct the json payload to send to addInput
    //   const jsonPayload = JSON.stringify({
    //     method: "createProfile",
    //     data: {
    //       username: username,
    //       bio: bio,
    //       profile_pic: dp,
    //     },
    //   });
    //   // addInput(JSON.stringify(jsonPayload));
    //   // console.log(JSON.stringify(jsonPayload));

    //   const res = await addInput(JSON.stringify(jsonPayload));
    //   console.log(res);
    //   const receipt = await res?.wait(1);
    //   console.log(receipt);
    //   const event = receipt?.events?.find((e) => e.event === "InputAdded");
    //   console.log(event);

    //   if (event) {
    //     setOpen(false);
    //   }

    //   toast.success("Profile created");
    // };

    // if (currentTriggeredPlayerPosition === "striker1") {
    //   // striker1.current.querySelector("div")
    // } else if (currentTriggeredPlayerPosition === "striker2") {
    //   // striker1.current.querySelector("div")
    //   selectedPlayerInfo[currentTriggeredPlayerPosition] = {
    //     name: playerData.name,
    //     rating: playerData.overall_rating,
    //   };
    // }
    // console.log(el.target.querySelector(".player-name"));
    // console.log(
    //   (selectedPlayerInfo[currentTriggeredPlayerPosition] = {
    //     name: el.target.querySelector(".player-name")?.innerHTML,
    //     rating: el.target.querySelector(".player-rating")?.innerHTML,
    //   })
    // );
    // setSelectedPlayerInfo((v) => {
    //   (selectedPlayerInfo[currentTriggeredPlayerPosition] = {
    //     name: el.target.querySelector(".player-name")?.value,
    //     rating: el.target.querySelector(".player-rating")?.value,
    //   }),
    //     { ...v };
    // });
    // setSelectedPlayerInfo((v) => {
    //   (selectedPlayerInfo[currentTriggeredPlayerPosition] = {
    //     name: playerData.name,
    //     rating: playerData.overall_rating,
    //   }),
    //     { ...v };
    // });
    // console.log(
    //   (setSelectedPlayerInfo[currentTriggeredPlayerPosition] = {
    //     name: playerData.name,
    //     rating: playerData.rating,
    //   })
    // );
    // console.log(playerData);
    // console.log(selectedPlayerInfo);
  };
  const closeSelectPlayerList = () => {
    setIsPlayerListOpen(false);
  };

  return (
    <section className="fixed left-0 right-0 z-40 flex flex-col justify-start items-center w-full h-full bg-base-300/70">
      {isPlayerListOpen && (
        <section className="player-list-container absolute top-4 left-0 bg-base-100 overflow-y-auto w-3/12 h-[96%] ml-4 px-2 rounded-box">
          <div className="font-semibold text-2xl px-4 py-8">
            Select your Players
          </div>
          <button
            type="button"
            className="btn rounded-box absolute right-4 top-8"
            onClick={closeSelectPlayerList}
          >
            <LucideX />
          </button>

          <div className="collapse collapse-arrow space-y-4 has-[:disabled]:opacity-30">
            <input
              type="checkbox"
              disabled={currentTriggeredPlayerType !== "goalkeeper"}
            />
            <div className="collapse-title text-2xl">Goal Keeper</div>
            <div className="collapse-content space-y-2">
              {PlayerData.filter(
                (it) => it.position.toLowerCase() === "goalkeeper"
              ).map((eachPlayer, index) => (
                <div
                  key={index}
                  className="card flex flex-row items-center gap-3 p-3 bg-base-200"
                  onClick={(e) => {
                    handleSelectPlayer(e, eachPlayer);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="player-name">{eachPlayer.name}</div>
                    <div className="player-position text-sm">
                      {eachPlayer.position}
                    </div>
                  </div>
                  <div className="">{eachPlayer.overall_rating}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="collapse collapse-arrow space-y-4 has-[:disabled]:opacity-30">
            <input
              type="checkbox"
              disabled={currentTriggeredPlayerType !== "striker"}
            />
            <div className="collapse-title text-2xl py-4">Strikers</div>
            <div className="collapse-content space-y-2">
              {PlayerData.filter(
                (it) => it.position.toLowerCase() === "striker"
              ).map((eachPlayer, index) => (
                <PlayerListCard
                  key={index}
                  _playerData={eachPlayer}
                  handleClick={(e) => {
                    handleSelectPlayer(e, eachPlayer);
                  }}
                />
                // <div
                //   key={index}
                //   className="card flex flex-row items-center gap-3 p-3 bg-base-200"
                //   onClick={(e) => {
                //     handleSelectPlayer(e, eachPlayer);
                //   }}
                // >
                //   <div className="flex flex-col flex-1">
                //     <div className="player-name">{eachPlayer.name}</div>
                //     <div className="player-position text-sm">
                //       {eachPlayer.position}
                //     </div>
                //   </div>
                //   <div className="">{eachPlayer.overall_rating}</div>
                // </div>
              ))}
            </div>
          </div>

          <div className="collapse collapse-arrow space-y-4 has-[:disabled]:opacity-30">
            <input
              type="checkbox"
              disabled={currentTriggeredPlayerType !== "midfielder"}
            />
            <div className="collapse-title text-2xl py-4">Midfielders</div>
            <div className="collapse-content space-y-2">
              {PlayerData.filter((it) =>
                it.position.toLowerCase().split(" ").includes("midfielder")
              ).map((eachPlayer, index) => (
                <div
                  key={index}
                  className="card flex flex-row items-center gap-3 p-3 bg-base-200"
                  onClick={(e) => {
                    handleSelectPlayer(e, eachPlayer);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="player-name">{eachPlayer.name}</div>
                    <div className="player-position text-sm">
                      {eachPlayer.position}
                    </div>
                  </div>
                  <div className="">{eachPlayer.overall_rating}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="collapse collapse-arrow space-y-4 has-[:disabled]:opacity-30">
            <input
              type="checkbox"
              disabled={currentTriggeredPlayerType !== "defender"}
            />
            <div className="collapse-title text-2xl py-4">Defenders</div>
            <div className="collapse-content space-y-2">
              {PlayerData.filter((it) =>
                it.position.toLowerCase().split("-").includes("back")
              ).map((eachPlayer, index) => (
                <div
                  key={index}
                  className="card flex flex-row items-center gap-3 p-3 bg-base-200"
                  onClick={(e) => {
                    handleSelectPlayer(e, eachPlayer);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="player-name">{eachPlayer.name}</div>
                    <div className="player-position text-sm">
                      {eachPlayer.position}
                    </div>
                  </div>
                  <div className="">{eachPlayer.overall_rating}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isGameSimulationResultPanel && (
        <section className="player-list-container absolute top-0 left-0 bg-base-100 overflow-y-auto w-3/12 h-screen">
          <div className="text-3xl px-4 py-8">Match Prediction</div>
          <button
            type="button"
            className="btn btn-ghost rounded-box absolute right-4 top-8"
            onClick={closeSelectPlayerList}
          ></button>

          {noticesData && (
            <section>
              <div>
                {noticesData?.match_status === 1 && (
                  <div>You will likely win this match</div>
                )}
                {noticesData?.match_status === 2 && (
                  <div>Computer is likely win this match</div>
                )}
                {noticesData?.match_status === 0 && <div>We forsee a</div>}
              </div>
              <div>
                <header>Match Odds</header>
                <div>Your Odd: {noticesData.home_odds}</div>
                <div>Computer Odd: {noticesData.away_odds}</div>
                <div>Draw Odd: {noticesData.draw_odds}</div>
              </div>
            </section>
          )}

          <div className="collapse collapse-arrow space-y-4 has-[:disabled]:opacity-30">
            <input
              type="checkbox"
              disabled={currentTriggeredPlayerType !== "goalkeeper"}
            />
            <div className="collapse-title text-2xl">Goal Keeper</div>
            <div className="collapse-content space-y-2">
              {PlayerData.filter(
                (it) => it.position.toLowerCase() === "goalkeeper"
              ).map((eachPlayer, index) => (
                <div
                  key={index}
                  className="card flex flex-row items-center gap-3 p-3 bg-base-200"
                  onClick={(e) => {
                    handleSelectPlayer(e, eachPlayer);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="player-name">{eachPlayer.name}</div>
                    <div className="player-position text-sm">
                      {eachPlayer.position}
                    </div>
                  </div>
                  <div className="">{eachPlayer.overall_rating}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="collapse collapse-arrow space-y-4 has-[:disabled]:opacity-30">
            <input
              type="checkbox"
              disabled={currentTriggeredPlayerType !== "striker"}
            />
            <div className="collapse-title text-2xl py-4">Strikers</div>
            <div className="collapse-content space-y-2">
              {PlayerData.filter(
                (it) => it.position.toLowerCase() === "striker"
              ).map((eachPlayer, index) => (
                <PlayerListCard
                  key={index}
                  _playerData={eachPlayer}
                  handleClick={(e) => {
                    handleSelectPlayer(e, eachPlayer);
                  }}
                />
                // <div
                //   key={index}
                //   className="card flex flex-row items-center gap-3 p-3 bg-base-200"
                //   onClick={(e) => {
                //     handleSelectPlayer(e, eachPlayer);
                //   }}
                // >
                //   <div className="flex flex-col flex-1">
                //     <div className="player-name">{eachPlayer.name}</div>
                //     <div className="player-position text-sm">
                //       {eachPlayer.position}
                //     </div>
                //   </div>
                //   <div className="">{eachPlayer.overall_rating}</div>
                // </div>
              ))}
            </div>
          </div>

          <div className="collapse collapse-arrow space-y-4 has-[:disabled]:opacity-30">
            <input
              type="checkbox"
              disabled={currentTriggeredPlayerType !== "midfielder"}
            />
            <div className="collapse-title text-2xl py-4">Midfielders</div>
            <div className="collapse-content space-y-2">
              {PlayerData.filter((it) =>
                it.position.toLowerCase().split(" ").includes("midfielder")
              ).map((eachPlayer, index) => (
                <div
                  key={index}
                  className="card flex flex-row items-center gap-3 p-3 bg-base-200"
                  onClick={(e) => {
                    handleSelectPlayer(e, eachPlayer);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="player-name">{eachPlayer.name}</div>
                    <div className="player-position text-sm">
                      {eachPlayer.position}
                    </div>
                  </div>
                  <div className="">{eachPlayer.overall_rating}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="collapse collapse-arrow space-y-4 has-[:disabled]:opacity-30">
            <input
              type="checkbox"
              disabled={currentTriggeredPlayerType !== "defender"}
            />
            <div className="collapse-title text-2xl py-4">Defenders</div>
            <div className="collapse-content space-y-2">
              {PlayerData.filter((it) =>
                it.position.toLowerCase().split("-").includes("back")
              ).map((eachPlayer, index) => (
                <div
                  key={index}
                  className="card flex flex-row items-center gap-3 p-3 bg-base-200"
                  onClick={(e) => {
                    handleSelectPlayer(e, eachPlayer);
                  }}
                >
                  <div className="flex flex-col flex-1">
                    <div className="player-name">{eachPlayer.name}</div>
                    <div className="player-position text-sm">
                      {eachPlayer.position}
                    </div>
                  </div>
                  <div className="">{eachPlayer.overall_rating}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="player-selection-container w-[600px]">
        <div className="player-container striker-container relative flex flex-row items-end justify-center space-x-16 bg-orang-300/40 w-full h-[280px]">
          <div
            className="striker-box flex flex-col justify-center items-center"
            ref={striker1}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "striker", "striker1");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.striker1.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.striker1.name) || ""}
            </span>
          </div>
          <div
            className="striker-box flex flex-col justify-center items-center"
            ref={striker2}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "striker", "striker2");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.striker2.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.striker2.name) || ""}
            </span>
          </div>
          <div
            className="striker-box flex flex-col justify-center items-center"
            ref={striker3}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "striker", "striker3");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.striker3.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.striker3.name) || ""}
            </span>
          </div>
        </div>
        <div className="midfielder-container relative flex flex-row items-center justify-center space-x-16 bg-orang-300/40 w-full h-[280px]">
          <div
            className="midfielder-box flex flex-col justify-center items-center"
            ref={midfielder1}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "midfielder", "midfielder1");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.midfielder1.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.midfielder1.name) || ""}
            </span>
          </div>
          <div
            className="midfielder-box flex flex-col justify-center items-center"
            ref={midfielder2}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "midfielder", "midfielder2");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.midfielder2.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.midfielder2.name) || ""}
            </span>
          </div>
          <div
            className="midfielder-box flex flex-col justify-center items-center"
            ref={midfielder3}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "midfielder", "midfielder3");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.midfielder3.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.midfielder3.name) || ""}
            </span>
          </div>
        </div>
        <div className="defender-container relative flex flex-row items-start justify-center space-x-12 bg-orang-300/40 w-full h-[160px]">
          <div
            className="defender-box flex flex-col justify-center items-center"
            ref={defender1}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "defender", "defender1");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.defender1.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.defender1.name) || ""}
            </span>
          </div>
          <div
            className="defender-box flex flex-col justify-center items-center"
            ref={defender2}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "defender", "defender2");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.defender2.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.defender2.name) || ""}
            </span>
          </div>
          <div
            className="defender-box flex flex-col justify-center items-center"
            ref={defender3}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "defender", "defender3");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.defender3.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.defender3.name) || ""}
            </span>
          </div>
          <div
            className="defender-box flex flex-col justify-center items-center"
            ref={defender4}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "defender", "defender4");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.defender4.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.defender4.name) || ""}
            </span>
          </div>
        </div>
        <div className="keeper-container relative flex flex-row items-start justify-center space-x-16 bg-orang-300/40 w-full">
          <div
            className="keeper-box flex flex-col justify-center items-center"
            ref={goalkeeper}
            onClick={(e) => {
              handleTriggerSelectPlayer(e, "goalkeeper", "goalkeeper");
            }}
          >
            <div className="size-20 rounded-box shadow-lg bg-green-300/40 cursor-pointer text-center leading-[80px] text-4xl font-bold">
              {selectedPlayerInfo?.goalkeeper.rating}
            </div>
            <span>
              {shortenPlayerNames(selectedPlayerInfo?.goalkeeper.name) || ""}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
