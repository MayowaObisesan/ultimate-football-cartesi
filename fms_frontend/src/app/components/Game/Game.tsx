"use client";

import React, { useEffect, useRef, useState } from "react";
import SAT from "../../utils/SAT";
import homePlayerSrc from "/public/img/homePlayer.png";
import awayPlayerSrc from "/public/img/awayPlayer.png";
import goalSrc from "/public/img/goal.png";
import NextImage from "next/image";
import { PlayerCard } from "../PlayerCard/PlayerCard";
import PlayerData from "../../utils/player.json";
import { PlayerSelection } from "../PlayerSelection/PlayerSelection";
import { usePeepsContext } from "../../context";
import { PlayerListCard } from "../PlayerListCard/PlayerListCard";
import { useRollups } from "../../useRollups";
import { defaultDappAddress } from "../../utils/constants";
import { ethers } from "ethers";
import { ButtonLoader } from "../Button";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useWallets } from "@web3-onboard/react";
import { Input } from "../../Input";
import { Network } from "../../Network";
import { GraphQLProvider } from "../../GraphQL";
import toast from "react-hot-toast";
import { gql, useQuery } from "@apollo/client";
import {
  LucideUserSearch,
  LucideUsers,
  LucideX,
  PlaySquare,
  PlusSquare,
} from "lucide-react";
import Link from "next/link";
import { GameEntryModal } from "./GameEntryModal";
import { CreateGameFormModal } from "./CreateGameFormModal";
import { eightRandomNumber } from "../../utils";
import { JoinGameFormModal } from "./JoinGameFormModal";
import { VictoryModal } from "./VictoryModal";
import { LossModal } from "./LossGameFormModal";
import { MatchDrawnModal } from "./drawGameFormModal";

export interface GameTypeProps {
  gameType?: "single" | "duel" | "duelBet";
}

type Notice = {
  id: string;
  index: number;
  input: any; //{index: number; epoch: {index: number; }
  payload: string;
};

// GraphQL query to retrieve notices given a cursor
const GET_NOTICES_CURSOR = gql`
  query GetNotices($cursor: String) {
    notices(first: 100) {
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

const GET_NOTICES_OLD = gql`
  query GetNotices($cursor: String) {
    notices {
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

const GET_NOTICES = gql`
  query notices {
    notices {
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

const useReexecuteQuery = () => {
  const [noticesData, setNoticesData] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [endCursor, setEndCursor] = useState(20);
  const { loading, error, data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    pollInterval: 1000,
  });
  const { baseNotices, reloadNotices, updateReloadNotices, updateBaseNotices } =
    usePeepsContext();

  useEffect(() => {
    console.log("Triggered reload notices");
    const notices: Notice[] = data?.notices.edges
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
    setNoticesData(notices);
    updateBaseNotices(notices);
    setIsSuccess(true);
    console.log("Fetching notices");
    console.log(notices);
    console.log(baseNotices);
    updateReloadNotices(false);
  }, [reloadNotices]);

  // const reExecutedQuery = notices;
  return { loading, error, data, noticesData, isSuccess };

  // return useQuery(GET_NOTICES, { variables: { cursor } });
};

const Game: React.FC<GameTypeProps> = ({ gameType }) => {
  const { loading, error, data, noticesData, isSuccess } = useReexecuteQuery();
  // const { loading, error, data } = getReexecutedQueryResult;
  const canvas = useRef<HTMLCanvasElement>(null);
  const gameOverScreen = useRef(null);
  const startScreenContainer = useRef(null);
  const [awayTeam, setAwayTeam] = useState(0);
  const [homeTeam, setHomeTeam] = useState(0);
  const [countDown, setCountDown] = useState("01:30");
  const [gameStatus, setGameStatus] = useState<string[]>([]);
  const [goalScored, setGoalScored] = useState<boolean>(false);
  // const ctx = useRef(canvas.current);
  const [ctx, setCtx] = useState(canvas.current);
  const [goalTeam, setGoalTeam] = useState("");
  const teamMapping = {
    home: "Madrid", // homeTeamName
    away: "Barcelona", // awayTeamName
  };

  const {
    baseDappAddress,
    baseNotices,
    updateBaseNotices,
    currentMatchIds,
    selectedPlayerList,
    updateCurrentMatchIds,
    updateReloadNotices,
    wallet,
  } = usePeepsContext();
  const [showPlayerSelectionPanel, setShowPlayerSelectionPanel] =
    useState<boolean>(false);
  console.log(currentMatchIds);
  const [showCreateMatchModal, setShowCreateMatchModal] =
    useState<boolean>(false);
  const rollups = useRollups(baseDappAddress);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const profileFormCloseButton = useRef(null);

  const [etherAmount, setEtherAmount] = useState<number>(0);

  const [simulationResult, setSimulationResult] = useState(null);
  const [matchId, setMatchId] = useState<number>(0);
  const goalCommentary = [
    "An extra-ordinary Goal from an extra-ordinary player",
    "Would you look at that. Simply spectacular",
    "What a Goal, Simply world class.",
  ];
  const [fetchNoticeFlag, setFetchNoticeFlag] = useState<boolean>(false);
  const [aiSpeed, setAiSpeed] = useState<number>(1.0);
  const [homeSpeed, setHomeSpeed] = useState<number>(1.0);
  const [gameWinStatus, setGameWinStatus] = useState<string>("");

  // Deposit ether
  // const [connectedWallet] = useWallets();
  // const provider = new ethers.providers.Web3Provider(connectedWallet?.provider);
  // const depositEtherToPortal = async (amount: number) => {
  //   try {
  //     if (rollups && provider) {
  //       const data = ethers.utils.toUtf8Bytes(`Deposited (${amount}) ether.`);
  //       const txOverrides = { value: ethers.utils.parseEther(`${amount}`) };

  //       // const tx = await ...
  //       rollups.etherPortalContract.depositEther(
  //         // propos.dappAddress,
  //         defaultDappAddress,
  //         data,
  //         txOverrides
  //       );
  //     }
  //   } catch (e) {
  //     console.log(`${e}`);
  //   }
  // };
  // const transferERC20 = async (from: string, to: string, amount: number) => {
  //   let obj = {
  //     method: "erc20_transfer",
  //     from: from,
  //     to: to,
  //     erc20: this.erc20TokenAddress,
  //     amount: ethers.utils.parseEther(`${amount}`).toString(),
  //   };
  //   try {
  //     if (rollups && provider) {
  //       const data = ethers.utils.toUtf8Bytes(`Deposited (${amount}) ether.`);
  //       const txOverrides = { value: ethers.utils.parseEther(`${amount}`) };

  //       // const tx = await ...
  //       rollups.etherPortalContract.depositEther(
  //         // propos.dappAddress,
  //         defaultDappAddress,
  //         data,
  //         txOverrides
  //       );
  //     }
  //   } catch (e) {
  //     console.log(`${e}`);
  //   }
  // };

  const openPlayerSelectionPanel = () => {
    setShowPlayerSelectionPanel(true);
  };

  const closePlayerSelectionPanel = () => {
    setShowPlayerSelectionPanel(false);
  };

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

  const handleSimulateMatch = async () => {
    setIsSubmit(true);
    // construct the json payload to send to addInput
    const jsonPayload = JSON.stringify({
      method: "create_challenge",
      // "fighter_hash": SHA256(inputString).toString(enc.Hex),
      token: "0x000",
      amount: "10000",
    });
    // addInput(JSON.stringify(jsonPayload));
    // console.log(JSON.stringify(jsonPayload));

    const res = await addInput(JSON.stringify(jsonPayload));
    console.log(res);
    const receipt = await res?.wait(1);
    console.log(receipt);
    const event = receipt?.events?.find((e) => e.event === "InputAdded");
    console.log(event);

    if (event) {
      setOpen(false);
    }

    toast.success("Profile created");
  };

  const handleSimulateMatchAgainstComputer = async () => {
    setIsSubmit(true);

    const _matchId = eightRandomNumber();
    console.log("Current match ID", _matchId);
    // construct the json payload to send to addInput
    const jsonPayload = {
      method: "simulate_match_against_computer",
      data: {
        team1: selectedPlayerList,
        match_id: _matchId,
      },
    };
    setMatchId(_matchId);

    const res = await addInput(JSON.stringify(jsonPayload));
    const receipt = await res?.wait(1);
    const event = receipt?.events?.find((e) => e.event === "InputAdded");

    // if (event) {
    //   // alert("simulation complete");
    // }
    if (event?.event === "InputAdded") {
      toast.success("Simulation complete");
      // set the match Id
      if (gameType === "single") {
        updateCurrentMatchIds("singleMatchId", _matchId);
        console.log("current matchID updated", currentMatchIds);
        updateReloadNotices(true);
        closePlayerSelectionPanel();

        // if (gameType === "single") {
        //   const _currentNoticedata = baseNotices?.filter(
        //     (it) =>
        //       JSON.parse(it.payload).match_id === currentMatchIds.singleMatchId
        //   );
        //   console.log(_currentNoticedata);
        //   setAiSpeed(
        //     JSON.parse(_currentNoticedata.payload).home_odds /
        //       JSON.parse(_currentNoticedata.payload).away_odds
        //   );
        // }
        // setAiSpeed(currentMatchIds);
      }
      // reexecuteQuery();
      setFetchNoticeFlag(true);
    }

    console.log(res);
    console.log(receipt);
  };

  // NOTICES
  // const [cursor, setCursor] = useState(null);
  // const [endCursor, setEndCursor] = useState(20);
  // const { loading, error, data } = useQuery(GET_NOTICES, {
  //   variables: { cursor },
  //   // pollInterval: 1000,
  // });

  // if (fetching) return <p>Loading...</p>;
  if (loading) {
    toast("Registering players. Please hold");
    // return (
    //   <EmptyPage
    //     icon={<span className="loading loading-dots loading-lg"></span>}
    //     text={""}
    //   >
    //     <div className="text-xl">Loading...</div>
    //   </EmptyPage>
    // );
  }
  // if (error) return <p>Oh no... {error.message}</p>;

  // if (!data || !data.notices) {
  //   // toast("No Notices yet");
  //   // return (
  //   //   <EmptyPage
  //   //     icon={<MessageSquareText size={48} />}
  //   //     text={"No posts yet"}
  //   //   ></EmptyPage>
  //   // );
  // }

  // const notices: Notice[] = data?.notices.edges
  //   .map((node: any) => {
  //     const n = node.node;
  //     let inputPayload = n?.input.payload;
  //     if (inputPayload) {
  //       try {
  //         inputPayload = ethers.utils.toUtf8String(inputPayload);
  //       } catch (e) {
  //         inputPayload = inputPayload + " (hex)";
  //       }
  //     } else {
  //       inputPayload = "(empty)";
  //     }
  //     let payload = n?.payload;
  //     if (payload) {
  //       try {
  //         payload = ethers.utils.toUtf8String(payload);
  //       } catch (e) {
  //         payload = payload + " (hex)";
  //       }
  //     } else {
  //       payload = "(empty)";
  //     }
  //     return {
  //       id: `${n?.id}`,
  //       index: parseInt(n?.index),
  //       payload: `${payload}`,
  //       input: n ? { index: n.input.index, payload: inputPayload } : {},
  //     };
  //   })
  //   .sort((b: any, a: any) => {
  //     if (a.input.index === b.input.index) {
  //       return b.index - a.index;
  //     } else {
  //       return b.input.index - a.input.index;
  //     }
  //   });

  // if (notices?.length < 1) {
  //   // toast("No notices")
  //   // return (
  //   //   <EmptyPage
  //   //     icon={<MessageSquareText size={48} />}
  //   //     text={"No posts yet"}
  //   //   ></EmptyPage>
  //   // );
  // }
  useEffect(() => {
    if (gameType === "single") {
      // if (notices.length > 0) {
      //   // JSON.parse(notices[0].payload).find()
      //   // if (JSON.parse(notices[0].payload).match_id === current) {}
      // }
    }
    toast.success("Notices detected");
    if (fetchNoticeFlag && noticesData?.length > 0) {
      console.log(noticesData);
      console.log(JSON.parse(noticesData[0].payload));
      updateBaseNotices(noticesData);
      setFetchNoticeFlag(false);
      updateReloadNotices(true);
      console.log(noticesData);
    }
    // setSimulationResult(JSON.parse(notices[0].payload));
    // if (notices.length > 0) {
    // }
  }, [isSuccess]);

  useEffect(() => {
    console.log("Refetched baseNotices");
    console.log(baseNotices);
  }, [isSuccess]);
  // console.log(notices);
  // NOTICES END

  //build canvas
  //   var canvas = document.getElementById("myCanvas");
  // var ctx = canvas.current?.getContext("2d");
  // var ctx;

  //set initial ball location
  var x = canvas.current?.width / 2;
  var y = canvas.current?.height / 2;

  //set ball radius
  var ballRadius = 6;

  //set ball speed
  var dx = 3;
  var dy = -3;

  //initialize ball speed
  var m = 0;
  var p = 0;
  var j = 0;

  // var aiSpeed = 1.25;
  // useEffect(() => {}, [])

  //set paddle dimensions
  var paddleHeight = 10;
  var paddleWidth = 30;

  var paddleX = canvas.current?.width - paddleWidth;

  //initialize keypress status
  var rightPressed = false;
  var leftPressed = false;

  //set goalpost dimensions
  var goalpostWidth = 150;
  var goalpostHeight = 10;

  //initialize scorecard
  var homeScore = 0;
  var awayScore = 0;

  //set player dimensions
  var playerHeight = 50;
  var playerWidth = 30;

  //set flags
  var initFlag = true;
  var gameOver = false;
  var flag1 = 1;
  var flag2 = 1;
  var drawFlag = true;

  //register for keypress events
  // document.addEventListener("keydown", keyDownHandler, false);
  // document.addEventListener("keyup", keyUpHandler, false);

  //initialize SAT.js variables
  var V = SAT.Vector;
  var C = SAT.Circle;
  var B = SAT.Box;

  var circle;
  var box;

  //initialize images
  var homePlayer = new Image();
  var awayPlayer = new Image();
  // let homePlayer;
  // let awayPlayer;
  useEffect(() => {
    homePlayer.src = homePlayerSrc?.src;
    awayPlayer.src = awayPlayerSrc?.src;
    homePlayer.onload = () => {
      // ctx = canvas.current?.getContext("2d");
      setCtx(canvas.current?.getContext("2d"));
      console.log("Load images", homePlayerSrc, homePlayer);
    };
  }, []);

  useEffect(() => {
    console.log("set home player again");
  }, [ctx]);

  let allowControl = false;

  //it all starts here
  function init() {
    if (gameType === "single") {
      const _currentNoticedata = baseNotices?.filter(
        (it) =>
          JSON.parse(it.payload).match_id === currentMatchIds.singleMatchId
      );
      console.log(_currentNoticedata);
      setAiSpeed(JSON.parse(_currentNoticedata[0].payload).ai_speed + aiSpeed);
      setHomeSpeed(
        JSON.parse(_currentNoticedata[0].payload).home_speed + homeSpeed
      );
    }

    removeStatus();
    // homePlayer.src = "/public/img/homePlayer.png";
    // awayPlayer.src = "/public/img/awayPlayer.png";
    homePlayer.src = homePlayerSrc.src;
    awayPlayer.src = awayPlayerSrc.src;
    console.log(homePlayer);
    // document.getElementById("startScreen").style["z-index"] = "-1";
    // document.getElementById("gameOverScreen").style["z-index"] = "-1";

    /*
    startScreenContainer.current.style["z-index"] = "-1";
    gameOverScreen.current.style["z-index"] = "-1";
    */

    // document.getElementById("home").innerHTML = "0";
    // document.getElementById("away").innerHTML = "0";
    setHomeTeam(0);
    setAwayTeam(0);
    awayScore = 0;
    homeScore = 0;
    gameOver = false;
    setInitialDelay();
  }

  function setInitialDelay() {
    setTimeout(function () {
      startTimer(60 * 0.5);
      drawFlag = true;
      window.requestAnimationFrame(draw);
      // updateStatus('You are team <br> in <span style="color:red">RED</span>');
      updateStatus("Match has started");
      updateStatus(
        "An Intense match between two formidable opponents have begun"
      );
    }, 1500);
  }

  function setDelay() {
    setTimeout(function () {
      drawFlag = true;
      window.requestAnimationFrame(draw);
    }, 1500);
  }

  function startTimer(duration: number) {
    var timer = duration,
      minutes,
      seconds;
    const countDownId = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      //   document.getElementById("countdown").innerHTML = minutes + ":" + seconds;
      setCountDown(minutes + ":" + seconds);

      if (--timer < 0) {
        // document.getElementById("gameOverScreen").style["z-index"] = 3;
        // gameOverScreen.current.style["z-index"] = 3;
        gameOver = true;
        clearInterval(countDownId);
        if (homeScore > awayScore) {
          // updateStatus("GAME OVER!<br>Liverpool Won!")
          // updateStatus("GAME OVER");
          updateStatus("This exciting match finally comes to an end");
          setTimeout(() => {
            // <VictoryModal />;
          }, 1000);
          setGameWinStatus("win");
        } else if (awayScore > homeScore) {
          updateStatus(
            "Your players definitely gave their best, but you were bested."
          );
          updateStatus(
            "Time to train more will definitely be in the mind of the players now."
          );
          setGameWinStatus("loss");
          // updateStatus("GAME OVER!<br>Juventus Won!");
        } else {
          // updateStatus("GAME OVER!<br>Draw!");
          updateStatus(
            "This was truly a clash of professionals. You could see the action all through the 90 minutes."
          );
          updateStatus("But both teams have to share the spoil.");
          setGameWinStatus("draw");
        }
        updateStatus(
          "I truly hope we will see more action in the next clash between there two teams."
        );
        updateStatus(
          "Thanks for joining this match at this time. Until next time."
        );
        // removeStatus();

        // record the result of the match on the blockchain.
        // TODO: Implement claiming reward functionality.
      }
    }, 1000);
  }

  //it all happens here
  function draw() {
    // console.log("context ctx", ctx);
    ctx?.clearRect(0, 0, canvas.current?.width, canvas.current?.height);
    drawBall();
    drawPlayers();
    drawGoalPost();
    x += dx;
    y += dy;
    if (
      rightPressed &&
      (paddleX * 3) / 4 + m < canvas.current?.width - paddleWidth
    ) {
      m += 2;
    } else if (leftPressed && paddleX / 4 + m > 0) {
      m -= 2;
    }
    if (drawFlag && !gameOver) window.requestAnimationFrame(draw);
  }

  function drawBall() {
    ctx?.beginPath();
    ctx?.arc(x, y, ballRadius, 0, Math.PI * 2);
    // ctx.fillStyle = "white";
    ctx?.fill();
    ctx?.closePath();
    circle = new C(new V(x, y), 6);
    if (x + dx > canvas.current?.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
      if (x < 0) x = 0;
      if (x > canvas.current?.width) x = canvas.current?.width;
    }
    if (y + dy > canvas.current?.height - ballRadius || y + dy < ballRadius) {
      dy = -dy;
    }
  }

  function drawPlayers() {
    drawHomeTeam();
    drawAwayTeam();
  }

  function drawHomeTeam() {
    //home
    drawGoalkeeper();
    drawDefenders();
    drawMidfielders();
    drawStrikers();
  }

  function drawAwayTeam() {
    //away
    drawAwayGoalkeeper();
    drawAwayDefenders();
    drawAwayMidfielders();
    drawAwayStrikers();
  }

  function drawGoalPost() {
    //home
    ctx?.beginPath();
    var gphX = (canvas.current?.width - goalpostWidth) / 2;
    var gphY = canvas.current?.height - goalpostHeight;
    ctx?.rect(gphX, gphY, goalpostWidth, goalpostHeight);
    // ctx.fillStyle = "#9C9C9C";
    ctx.fillStyle = "whitesmoke";
    ctx?.fill();
    ctx?.closePath();
    box = new B(new V(gphX, gphY), goalpostWidth, goalpostHeight).toPolygon();
    if (goalDetection(box)) {
      updateScore("home");
      // updateStatus("GOAL!<br>Juventus Score!");
      updateStatus(
        goalCommentary[Math.floor(Math.random() * gameStatus.length)]
      );
      // removeStatus();
      resetBall();
      setDelay();
    }
    //away
    ctx?.beginPath();
    var gpaX = (canvas.current?.width - goalpostWidth) / 2;
    var gpaY = paddleHeight - goalpostHeight;
    ctx?.rect(gpaX, gpaY, goalpostWidth, goalpostHeight);
    // ctx.fillStyle = "#9C9C9C";
    ctx.fillStyle = "white";
    ctx?.fill();
    ctx?.closePath();

    box = new B(new V(gpaX, gpaY), goalpostWidth, goalpostHeight).toPolygon();
    if (goalDetection(box)) {
      updateScore("away");
      // updateStatus("GOAL!<br>Liverpool Score!");
      updateStatus(
        goalCommentary[Math.floor(Math.random() * gameStatus.length)]
      );
      // removeStatus();
      resetBall();
      setDelay();
    }
  }

  function updateScore(goal: string) {
    if (goal === "home") {
      awayScore += 1;
      //   document.getElementById("away").innerHTML = awayScore;
      setAwayTeam(awayScore);
    } else {
      homeScore += 1;
      //   document.getElementById("home").innerHTML = homeScore;
      setHomeTeam(homeScore);
      setGoalScored(true);
      setTimeout(() => {
        setGoalScored(false);
      }, 1400);
    }
  }

  function resetGame() {
    resetBall();
  }

  function resetBall() {
    x = canvas.current?.width / 2;
    y = canvas.current?.height / 2;
    drawBall();
    drawFlag = false;
    window.requestAnimationFrame(draw);
  }

  function updateStatus(message: string) {
    // document.getElementById("status").innerHTML = message;
    setGameStatus((v) => [message, ...v]);
    console.log(gameStatus);
  }

  function removeStatus() {
    setTimeout(function () {
      //   document.getElementById("status").innerHTML = "";
      setGameStatus([]);
    }, 1500);
  }

  function drawGoalkeeper() {
    if (allowControl) {
      var gkX = paddleX / 2 + m;
      var gkY = (canvas.current?.height * 7) / 8 - paddleHeight;
      ctx?.drawImage(homePlayer, gkX, gkY - 15, playerWidth, playerHeight);
      // drawRods(gkY);
      box = new B(new V(gkX, gkY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, gkX);
    } else {
      var gkX = paddleX / 2 + p;
      var gkY = (canvas.current?.height * 7) / 8 - paddleHeight;
      ctx?.drawImage(homePlayer, gkX, gkY - 15, playerWidth, playerHeight);
      // drawRods(gkY);
      box = new B(new V(gkX, gkY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, gkX);
    }

    if (!allowControl) {
      if (x > gkX && gkX < (paddleX * 3) / 4) p += homeSpeed;
      else if (gkX > (paddleX * 1) / 4) p -= homeSpeed;
    }
  }

  function drawDefenders() {
    if (allowControl) {
      var lcbX = paddleX / 4 + m;
      var lcbY = (canvas.current?.height * 13) / 16 - paddleHeight;
      // drawRods(lcbY);
      ctx?.drawImage(homePlayer, lcbX, lcbY - 15, playerWidth, playerHeight);
      box = new B(new V(lcbX, lcbY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, lcbX);

      var rcbX = (paddleX * 3) / 4 + p;
      var rcbY = (canvas.current?.height * 13) / 16 - paddleHeight;
      ctx?.drawImage(homePlayer, rcbX, rcbY - 15, playerWidth, playerHeight);
      box = new B(new V(rcbX, rcbY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, rcbX);
    } else {
      var lcbX = paddleX / 4 + p;
      var lcbY = (canvas.current?.height * 13) / 16 - paddleHeight;
      // drawRods(lcbY);
      ctx?.drawImage(homePlayer, lcbX, lcbY - 15, playerWidth, playerHeight);
      box = new B(new V(lcbX, lcbY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, lcbX);

      var rcbX = (paddleX * 3) / 4 + p;
      var rcbY = (canvas.current?.height * 13) / 16 - paddleHeight;
      ctx?.drawImage(homePlayer, rcbX, rcbY - 15, playerWidth, playerHeight);
      box = new B(new V(rcbX, rcbY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, rcbX);
    }

    if (!allowControl) {
      if (x > lcbX && lcbX < (paddleX * 3) / 4) p += homeSpeed;
      else if (lcbX > (paddleX * 1) / 4) j -= homeSpeed;
      if (x > rcbX && rcbX < (paddleX * 3) / 4) p += homeSpeed;
      else if (rcbX > (paddleX * 1) / 4) j -= homeSpeed;
    }
  }

  function drawMidfielders() {
    //midfielders
    if (allowControl) {
      var lwbX = (paddleX * 1) / 8 + m;
      var lwbY = (canvas.current?.height * 5) / 8 - paddleHeight;
      // drawRods(lwbY);
      ctx?.drawImage(homePlayer, lwbX, lwbY - 15, playerWidth, playerHeight);
      box = new B(new V(lwbX, lwbY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, lwbX);

      var lcmX = (paddleX * 3) / 8 + m;
      var lcmY = (canvas.current?.height * 5) / 8 - paddleHeight;
      ctx?.drawImage(homePlayer, lcmX, lcmY - 15, playerWidth, playerHeight);
      box = new B(new V(lcmX, lcmY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, lcmX);

      var rcmX = (paddleX * 5) / 8 + m;
      var rcmY = (canvas.current?.height * 5) / 8 - paddleHeight;
      ctx?.drawImage(homePlayer, rcmX, rcmY - 15, playerWidth, playerHeight);
      box = new B(new V(rcmX, rcmY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, rcmX);

      var rwbX = (paddleX * 7) / 8 + m;
      var rwbY = (canvas.current?.height * 5) / 8 - paddleHeight;
      ctx?.drawImage(homePlayer, rwbX, rwbY - 15, playerWidth, playerHeight);
      box = new B(new V(rwbX, rwbY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, rwbX);
    } else {
      var lwbX = (paddleX * 1) / 8 + p;
      var lwbY = (canvas.current?.height * 5) / 8 - paddleHeight;
      // drawRods(lwbY);
      ctx?.drawImage(homePlayer, lwbX, lwbY - 15, playerWidth, playerHeight);
      box = new B(new V(lwbX, lwbY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, lwbX);

      var lcmX = (paddleX * 3) / 8 + p;
      var lcmY = (canvas.current?.height * 5) / 8 - paddleHeight;
      ctx?.drawImage(homePlayer, lcmX, lcmY - 15, playerWidth, playerHeight);
      box = new B(new V(lcmX, lcmY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, lcmX);

      var rcmX = (paddleX * 5) / 8 + p;
      var rcmY = (canvas.current?.height * 5) / 8 - paddleHeight;
      ctx?.drawImage(homePlayer, rcmX, rcmY - 15, playerWidth, playerHeight);
      box = new B(new V(rcmX, rcmY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, rcmX);

      var rwbX = (paddleX * 7) / 8 + p;
      var rwbY = (canvas.current?.height * 5) / 8 - paddleHeight;
      ctx?.drawImage(homePlayer, rwbX, rwbY - 15, playerWidth, playerHeight);
      box = new B(new V(rwbX, rwbY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, rwbX);
    }

    if (!allowControl) {
      if (x > lwbX && lwbX < (paddleX * 3) / 4) p += homeSpeed;
      else if (lwbX > (paddleX * 1) / 4) p -= homeSpeed;
      if (x > rwbX && rwbX < (paddleX * 3) / 4) p += homeSpeed;
      else if (rwbX > (paddleX * 1) / 4) p -= homeSpeed;
      if (x > rcmX && rcmX < (paddleX * 3) / 4) p += homeSpeed;
      else if (rcmX > (paddleX * 1) / 4) p -= homeSpeed;
    }
  }

  function drawStrikers() {
    //attackers
    if (allowControl) {
      var lwX = paddleX / 4 + m;
      var lwY = (canvas.current?.height * 9) / 32 - paddleHeight;
      // drawRods(lwY);
      ctx?.drawImage(homePlayer, lwX, lwY - 15, playerWidth, playerHeight);
      box = new B(new V(lwX, lwY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, lwX);

      var cfX = paddleX / 2 + m;
      var cfY = (canvas.current?.height * 9) / 32 - paddleHeight;
      ctx?.drawImage(homePlayer, cfX, cfY - 15, playerWidth, playerHeight);
      box = new B(new V(cfX, cfY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, cfX);

      var rwX = (paddleX * 3) / 4 + m;
      var rwY = (canvas.current?.height * 9) / 32 - paddleHeight;
      ctx?.drawImage(homePlayer, rwX, rwY - 15, playerWidth, playerHeight);
      box = new B(new V(rwX, rwY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, rwX);
    } else {
      var lwX = paddleX / 4 + j;
      var lwY = (canvas.current?.height * 9) / 32 - paddleHeight;
      // drawRods(lwY);
      ctx?.drawImage(homePlayer, lwX, lwY - 15, playerWidth, playerHeight);
      box = new B(new V(lwX, lwY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, lwX);

      var cfX = paddleX / 2 + j;
      var cfY = (canvas.current?.height * 9) / 32 - paddleHeight;
      ctx?.drawImage(homePlayer, cfX, cfY - 15, playerWidth, playerHeight);
      box = new B(new V(cfX, cfY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, cfX);

      var rwX = (paddleX * 3) / 4 + j;
      var rwY = (canvas.current?.height * 9) / 32 - paddleHeight;
      ctx?.drawImage(homePlayer, rwX, rwY - 15, playerWidth, playerHeight);
      box = new B(new V(rwX, rwY), playerWidth, paddleHeight).toPolygon();
      collisionDetection(box, rwX);
    }

    if (!allowControl) {
      // let secSpeed = 1.5;
      if (x > lwX && lwX < (paddleX * 3) / 4) p += homeSpeed;
      else if (lwX > (paddleX * 1) / 4) p -= homeSpeed;
      if (x > rwX && rwX < (paddleX * 3) / 4) p += homeSpeed;
      else if (rwX > (paddleX * 1) / 4) p -= homeSpeed;
      if (x > cfX && cfX < (paddleX * 3) / 4) p += homeSpeed;
      else if (cfX > (paddleX * 1) / 4) p -= homeSpeed;
    }
  }

  function drawAwayGoalkeeper() {
    var gkX = paddleX / 2 + j;
    // var gkX = paddleX / 2 + m;
    var gkY = (canvas.current?.height * 1) / 8 - paddleHeight;
    // drawRods(gkY);
    ctx?.drawImage(awayPlayer, gkX, gkY - 15, playerWidth, playerHeight);
    box = new B(new V(gkX, gkY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, gkX);

    if (x > gkX && gkX < (paddleX * 3) / 4) j += aiSpeed;
    else if (gkX > (paddleX * 1) / 4) j -= aiSpeed;
  }

  function drawAwayDefenders() {
    var lcbX = paddleX / 4 + j;
    // var lcbX = paddleX / 4 + m;
    var lcbY = (canvas.current?.height * 3) / 16 - paddleHeight;
    // drawRods(lcbY);
    ctx?.drawImage(awayPlayer, lcbX, lcbY - 15, playerWidth, playerHeight);
    box = new B(new V(lcbX, lcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lcbX);

    var rcbX = (paddleX * 3) / 4 + j;
    // var rcbX = (paddleX * 3) / 4 + m;
    var rcbY = (canvas.current?.height * 3) / 16 - paddleHeight;
    ctx?.drawImage(awayPlayer, rcbX, rcbY - 15, playerWidth, playerHeight);
    box = new B(new V(rcbX, rcbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rcbX);

    if (x > lcbX && lcbX < (paddleX * 3) / 4) j += aiSpeed * 2;
    else if (lcbX > (paddleX * 1) / 4) j -= aiSpeed;
    if (x > rcbX && rcbX < (paddleX * 3) / 4) j += aiSpeed * 2;
    else if (rcbX > (paddleX * 1) / 4) j -= aiSpeed;
  }

  function drawAwayMidfielders() {
    //midfielders
    var lwbX = (paddleX * 1) / 8 + j;
    var lwbY = (canvas.current?.height * 3) / 8 - paddleHeight;
    // drawRods(lwbY)
    ctx?.drawImage(awayPlayer, lwbX, lwbY - 15, playerWidth, playerHeight);
    box = new B(new V(lwbX, lwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lwbX);

    var lcmX = (paddleX * 3) / 8 + j;
    var lcmY = (canvas.current?.height * 3) / 8 - paddleHeight;
    ctx?.drawImage(awayPlayer, lcmX, lcmY - 15, playerWidth, playerHeight);
    box = new B(new V(lcmX, lcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lcmX);

    var rcmX = (paddleX * 5) / 8 + j;
    var rcmY = (canvas.current?.height * 3) / 8 - paddleHeight;
    ctx?.drawImage(awayPlayer, rcmX, rcmY - 15, playerWidth, playerHeight);
    box = new B(new V(rcmX, rcmY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rcmX);

    var rwbX = (paddleX * 7) / 8 + j;
    var rwbY = (canvas.current?.height * 3) / 8 - paddleHeight;
    ctx?.drawImage(awayPlayer, rwbX, rwbY - 15, playerWidth, playerHeight);
    box = new B(new V(rwbX, rwbY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rwbX);

    if (x > lwbX && lwbX < (paddleX * 3) / 4) j += aiSpeed;
    else if (lwbX > (paddleX * 1) / 4) j -= aiSpeed;
    if (x > rwbX && rwbX < (paddleX * 3) / 4) j += aiSpeed;
    else if (rwbX > (paddleX * 1) / 4) j -= aiSpeed;
    if (x > rcmX && rcmX < (paddleX * 3) / 4) j += aiSpeed;
    else if (rcmX > (paddleX * 1) / 4) j -= aiSpeed;
    if (x > lcmX && lcmX < (paddleX * 3) / 4) j += aiSpeed;
    else if (lcmX > (paddleX * 1) / 4) j -= aiSpeed;
  }

  function drawAwayStrikers() {
    //attackers
    ctx?.beginPath();
    var lwX = paddleX / 4 + j;
    var lwY = (canvas.current?.height * 23) / 32 - paddleHeight;
    // drawRods(lwY);
    ctx?.drawImage(awayPlayer, lwX, lwY - 15, playerWidth, playerHeight);
    box = new B(new V(lwX, lwY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, lwX);

    ctx?.beginPath();
    var cfX = paddleX / 2 + j;
    var cfY = (canvas.current?.height * 23) / 32 - paddleHeight;
    ctx?.drawImage(awayPlayer, cfX, cfY - 15, playerWidth, playerHeight);
    box = new B(new V(cfX, cfY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, cfX);

    ctx?.beginPath();
    var rwX = (paddleX * 3) / 4 + j;
    var rwY = (canvas.current?.height * 23) / 32 - paddleHeight;
    ctx?.drawImage(awayPlayer, rwX, rwY - 15, playerWidth, playerHeight);
    box = new B(new V(rwX, rwY), playerWidth, paddleHeight).toPolygon();
    collisionDetectionAway(box, rwX);

    // if(y + 10 == rwY || y - 10 == rwY) {
    if (x > lwX && lwX < (paddleX * 3) / 4) j += aiSpeed;
    else if (lwX > (paddleX * 1) / 4) j -= aiSpeed;
    if (x > rwX && rwX < (paddleX * 3) / 4) j += aiSpeed;
    else if (rwX > (paddleX * 1) / 4) j -= aiSpeed;
    if (x > cfX && cfX < (paddleX * 3) / 4) j += aiSpeed;
    else if (cfX > (paddleX * 1) / 4) j -= aiSpeed;
    //}
  }

  function collisionDetection(box, pX) {
    var response = new SAT.Response();
    if (SAT.testPolygonCircle(box, circle, response)) {
      var speed = ((x + 12 / 2 - pX + 20 / 2) / (20 / 2)) * 5;
      if (flag1 == 1) {
        if (dy > 0) {
          dy = -dy;
          y = y - speed;
          if (dx > 0) x = x + speed;
          else x = x - speed;
        } else {
          y = y - speed;
          if (dx > 0) x = x - speed;
          else x = x + speed;
        }
        flag1 = 0;
      }
    } else flag1 = 1;
  }

  function collisionDetectionAway(box, pX) {
    var response = new SAT.Response();
    if (SAT.testPolygonCircle(box, circle, response)) {
      var speed = ((x + 12 / 2 - pX + 20 / 2) / (20 / 2)) * 5;
      if (flag2 == 1) {
        if (dy < 0) {
          dy = -dy;
          y = y + speed;
          if (dx > 0) x = x + speed;
          else x = x - speed;
        } else {
          y = y + speed;
          if (dx > 0) x = x + speed;
          else x = x - speed;
        }
      }
    } else flag2 = 1;
  }

  function goalDetection(box) {
    var response = new SAT.Response();
    return SAT.testPolygonCircle(box, circle, response);
  }

  function drawRods(yAxis) {
    ctx?.beginPath();
    ctx.rect(0, yAxis + 2, canvas.current?.width, paddleHeight - 5);
    ctx.fillStyle = "#BDBDBD";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
  }

  function keyDownHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = true;
    } else if (e.keyCode == 37) {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.keyCode == 39) {
      rightPressed = false;
    } else if (e.keyCode == 37) {
      leftPressed = false;
    }
  }

  return (
    <section className="flex flex-row items-start bg-slat-800 bg-base-200 w-full h-screen">
      <GameEntryModal />
      {/* <Image src={homePlayerSrc} alt={""} width={200} height={200} /> */}

      {/* <button id="playagain" onClick={init}>
        PLAY AGAIN
      </button>
      <h3 id="blue">Juventus</h3>
      <div id="away">{awayTeam}</div>
      <h3 id="red">Liverpool</h3>
      <div id="home">{homeTeam}</div> */}

      <section className="left-content relative w-3/12 bg-base-100 h-screen">
        <Link href={"/"} className="block text-3xl text-base-content p-8">
          <div className="font-bold">Ultimate</div>
          <span className="block text-5xl">Football</span>
          <div className="">
            {gameType === "single" ? (
              <div className="badge badge-lg badge-success">
                against Computer
              </div>
            ) : (
              <div className="badge badge-lg badge-success">duel</div>
            )}
          </div>
        </Link>
        {/* <div ref={gameOverScreen}>
          <div>Football game</div>
          <button id="playagain" onClick={init}>
            PLAY AGAIN
          </button>
        </div>
        <section className="start-screen-container" ref={startScreenContainer}>
          <div className="start-screen">
            <div className="header">Football Simulator Game</div>
            <div>Football on Chain</div>
            <div>Play Now</div>
          </div>
          <button id="playagain" onClick={init}>
            PLAY AGAIN
          </button>
        </section> */}
        <div className="mt-8 px-8">
          <button
            type="button"
            onClick={openPlayerSelectionPanel}
            className="btn flex flex-row gap-x-6"
          >
            <LucideUsers />
            Select Players
          </button>
        </div>
        {gameType === "duel" && (
          // <div className="mt-8 px-8">
          //   <button
          //     type="button"
          //     onClick={openPlayerSelectionPanel}
          //     className="btn flex flex-row gap-x-6"
          //   >
          //     <PlusSquare />
          //     Create Match
          //   </button>
          // </div>
          <CreateGameFormModal gameType={gameType} />
        )}
        {gameType === "duel" && (
          // <div className="mt-8 px-8">
          //   <button
          //     type="button"
          //     onClick={openPlayerSelectionPanel}
          //     className="btn flex flex-row gap-x-6"
          //   >
          //     <PlaySquare />
          //     Join Match
          //   </button>
          // </div>
          <JoinGameFormModal gameType={gameType} />
        )}
        <div className="mt-8 px-8">
          <button
            type="button"
            onClick={openPlayerSelectionPanel}
            className="btn flex flex-row gap-x-6"
          >
            <LucideUserSearch />
            Show Selected Players
          </button>
        </div>
        {/* <button type="button" onClick={() => updateReloadNotices(true)}>
          reload notices
        </button> */}
      </section>

      <div
        id="id-canvas-container"
        className="canvas-container relative flex-1 flex flex-row justify-center bg-purpl-400"
      >
        {goalScored && (
          <div className="absolute z-10 left-0 right-0 w-full h-full flex flex-row items-center justify-center scale-75">
            <NextImage
              src={goalSrc}
              alt={"Goal"}
              width={goalSrc?.width}
              height={goalSrc?.height}
            />
          </div>
        )}
        <canvas id="myCanvas" width="560" height="840" ref={canvas}></canvas>
      </div>

      <section>
        {showPlayerSelectionPanel && (
          <>
            <PlayerSelection noticesData={simulationResult} />
            <section className="player-action-container absolute top-4 right-0 z-40 bg-base-100 overflow-y-auto w-3/12 h-[96%] mr-4 px-2 rounded-box">
              <div className="w-full">
                <div className="hidden">
                  <span>You cannot modify your players beyond this point</span>
                  <span>Click the button below to proceed</span>
                  <button
                    type="button"
                    className="btn btn-lg btn-wide mx-auto"
                    onClick={handleSimulateMatchAgainstComputer}
                    disabled={selectedPlayerList.length !== 11}
                  >
                    Register your players
                  </button>
                </div>
              </div>

              {selectedPlayerList.length < 1 && (
                <div className="absolute flex flex-col justify-center items-center left-0 right-0 font-normal text-base text-balance text-center h-full px-16 bg-transparent">
                  Click on the box on the field to select your players
                </div>
              )}

              <div className="font-semibold text-center leading-normal py-8">
                Selected players for this epic match.
              </div>

              <button
                type="button"
                className="btn rounded-box absolute left-4 top-4"
                onClick={closePlayerSelectionPanel}
              >
                <LucideX />
              </button>

              <div className="space-y-4 py-4">
                {selectedPlayerList.reverse().map((eachPlayer, index) => (
                  // <div key={index} className="card shadow p-4 bg-orange-400">
                  //   {eachPlayer.name}
                  // </div>
                  <PlayerListCard
                    key={index}
                    _playerData={eachPlayer}
                    handleClick={() => {}}
                  />
                ))}
              </div>

              <div className="relative mx-auto flex flex-col items-center my-4">
                {selectedPlayerList.length === 11 && (
                  <button
                    type="button"
                    className="btn btn-lg btn-success btn-wide rounded-box"
                    onClick={handleSimulateMatchAgainstComputer}
                    disabled={selectedPlayerList.length !== 11}
                  >
                    Register your players
                  </button>
                )}
                {/* {
                  <button
                    type="button"
                    className="btn btn-lg btn-wide"
                    onClick={closePlayerSelectionPanel}
                  >
                    Start the match with these Players
                  </button>
                } */}
              </div>

              <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Trigger asChild>
                  <button
                    type="button"
                    className="hidden btn btn-block inline-flex h-[35px] items-center justify-center px-[15px] font-medium leading-none outline-none outline-0"
                    disabled={!wallet}
                  >
                    Create Profile
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
                  <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] bg-base-100 translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
                    <AlertDialog.Title className="text-mauve12 mt-4 mb-12 text-xl text-center font-bold">
                      Create your Profile
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-[15px] text-center leading-normal">
                      {/* We require this to serve the best experience */}
                      <div className="card items-center shrink-0 my-4 w-full bg-base-100">
                        {/* <AvatarProfile src={dp} />
                <label
                  htmlFor={"id-avatar-dp"}
                  title="Select dp"
                  className="btn btn-sm mt-4"
                >
                  <CameraIcon />
                  Select display picture
                  <input
                    type="file"
                    name=""
                    id="id-avatar-dp"
                    className="hidden"
                  />
                </label>
                <form className="card-body w-full">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Username</span>
                    </label>
                    <input
                      type="username"
                      placeholder="username"
                      className="input input-bordered"
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">About yourself</span>
                    </label>
                    <textarea
                      className="textarea textarea-lg textarea-bordered text-base resize-none"
                      placeholder="Tell the world something about yourself"
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form-control mt-6">
                    <button
                      type="button"
                      className="btn btn-primary rounded-xl"
                      onClick={handleCreateProfile}
                    >
                      {isSubmit ? <ButtonLoader /> : "Create Profile"}
                    </button>
                  </div>
                </form> */}
                        Registering your team. Do not refresh the page
                      </div>
                    </AlertDialog.Description>
                    <div className="absolute top-8 right-4 flex justify-end gap-[25px]">
                      <AlertDialog.Cancel asChild>
                        <button
                          title="Close profile dialog"
                          type="button"
                          className="btn size-12 rounded-full text-xl"
                          aria-label="Close"
                          ref={profileFormCloseButton}
                        >
                          <Cross2Icon size={64} />
                        </button>
                      </AlertDialog.Cancel>
                      {/* <AlertDialog.Action asChild>
            <button className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Yes, delete account
            </button>
          </AlertDialog.Action> */}
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>

              {/* <div>
                Deposit Ether <br />
                Amount:{" "}
                <input
                  type="number"
                  value={etherAmount}
                  onChange={(e) => setEtherAmount(Number(e.target.value))}
                />
                <button
                  onClick={() => depositEtherToPortal(etherAmount)}
                  disabled={!rollups}
                >
                  Deposit Ether
                </button>
                <br />
                <br />
              </div> */}

              {/* <Network /> */}
              <GraphQLProvider>
                {/* <Input dappAddress={defaultDappAddress} /> */}
              </GraphQLProvider>
            </section>
          </>
        )}
      </section>

      <div className="z-10 w-3/12">
        <div className="flex flex-col items-end justify-end px-2 py-2">
          {gameType === "single" && (
            <button
              type="button"
              className="btn btn-success btn-wide text-success-content"
              onClick={init}
              disabled={
                selectedPlayerList.length !== 11 ||
                currentMatchIds.singleMatchId === ""
              }
            >
              Start Match
            </button>
          )}
          {gameType === "single" && gameWinStatus === "win" ? (
            <VictoryModal />
          ) : gameWinStatus === "loss" ? (
            <LossModal />
          ) : gameWinStatus === "draw" ? (
            <MatchDrawnModal />
          ) : null}
          <div
            id="timer"
            className="flex flex-row items-center gap-x-4 my-4 p-6 rounded-md bg-base-200 shadow-lg"
          >
            <div id="home" className="font-bold text-4xl">
              {homeTeam}
            </div>
            {/* <div className="size-16 bg-orange-400 rounded-box"></div> */}
            <div
              id="countdown"
              className="font-bold text-4xl border-4 border-slate-600 rounded-lg p-4"
            >
              {/* Time Left */}
              {countDown}
            </div>
            {/* <div className="size-16 bg-blue-400 rounded-box"></div> */}
            <div id="away" className="font-bold text-4xl">
              {awayTeam}
            </div>
          </div>
        </div>
        <ul id="status" className="p-8 space-y-6 h-[60%] overflow-y-auto">
          {gameStatus.map((eachGameStatus, index) => (
            <li className="list-disc text-base leading-normal">
              {eachGameStatus}
            </li>
          ))}
        </ul>
      </div>

      <div
        id="game-marque"
        className="marquee fixed bottom-0 left-0 flex flex-row gap-x-8 w-full p-4 bg-slat-950 bg-base-200"
      >
        <div className="font-bold text-lg">
          <header className="text-sm">Your MatchID:</header>
          {gameType === "single" && <div>{currentMatchIds.singleMatchId}</div>}
          {gameType === "duel" && <div>{currentMatchIds.duelMatchId}</div>}
          {gameType === "duelBet" && (
            <div>{currentMatchIds.duelBetMatchId}</div>
          )}
        </div>
        {gameType === "single" &&
          baseNotices &&
          baseNotices
            .filter(
              (it) =>
                JSON.parse(it.payload).match_id ===
                currentMatchIds.singleMatchId
            )
            .map((eachNotice: any, index: number) => (
              <>
                <div className="">
                  Win Odds: {JSON.parse(eachNotice.payload).home_odds}
                </div>
                <div className="">
                  Loss Odds: {JSON.parse(eachNotice.payload).away_odds}
                </div>
                <div className="">
                  Draw Odds: {JSON.parse(eachNotice.payload).draw_odds}
                </div>
              </>
            ))}

        {gameType === "duel" &&
          baseNotices &&
          baseNotices
            .filter(
              (it) =>
                JSON.parse(it.payload).match_id === currentMatchIds.duelMatchId
            )
            .map((eachNotice: any, index: number) => (
              <>
                <div className="">
                  Team1 Odds: {JSON.parse(eachNotice.payload).home_odds}
                </div>
                <div className="">
                  Team2 Odds: {JSON.parse(eachNotice.payload).away_odds}
                </div>
                <div className="">
                  Draw Odds: {JSON.parse(eachNotice.payload).draw_odds}
                </div>
              </>
            ))}
        <div>
          {/* Team A is looking likely to win according to our statistics ran on
          cartesi machine */}
          {/* Team A is looking likely to win
          according to our statistics ran on cartesi machine.Team A is looking
          likely to win according to our statistics ran on cartesi machine.Team
          A is looking likely to win according to our statistics ran on cartesi
          machine. */}
        </div>
        <div className="bg-base-100">
          <GraphQLProvider>
            <Network />
          </GraphQLProvider>
        </div>
      </div>
    </section>
  );
};

export default Game;
