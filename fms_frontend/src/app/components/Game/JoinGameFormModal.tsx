"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { LucideX, PlaySquare, PlusSquare } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useRollups } from "../../useRollups";
import { ethers } from "ethers";
import { usePeepsContext } from "../../context";
import { defaultDappAddress } from "../../utils/constants";
import toast from "react-hot-toast";
import { ButtonLoader } from "../Button";
import { SHA256, enc } from "crypto-js";
import { GameTypeProps } from "./Game";
import { eightRandomNumber } from "../../utils";

import {
  IERC1155__factory,
  IERC20__factory,
  IERC721__factory,
} from "../../generated/rollups";
import { useWallets } from "@web3-onboard/react";
import { GameButton } from "../Button/Button";

export const JoinGameFormModal: React.FC<GameTypeProps> = ({ gameType }) => {
  const {
    baseDappAddress,
    currentMatchIds,
    selectedPlayerList,
    updateCurrentMatchIds,
    wallet,
  } = usePeepsContext();
  const rollups = useRollups(baseDappAddress);
  const [open, setOpen] = useState<boolean>(false);
  const gameEntryModalCloseButton = useRef(null);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [joinMatchId, setJoinMatchId] = useState<number>(0);
  const [matchId, setMatchId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [connectedWallet] = useWallets();
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (connectedWallet)
      setProvider(new ethers.providers.Web3Provider(connectedWallet.provider));
  }, [connectedWallet]);

  if (selectedPlayerList.length !== 11) {
    return (
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger asChild>
          {/* <button
        type="button"
        className="hidden btn btn-block inline-flex h-[35px] items-center justify-center px-[15px] font-medium leading-none outline-none outline-0"
        //   disabled={!wallet}
      >
        Create Profile
      </button> */}
          {/* <div className="mt-8 px-8">
            <button type="button" className="btn flex flex-row gap-x-6">
              <PlusSquare />
              Create Match
            </button>
          </div> */}
          <div className="mt-8 px-8">
            <GameButton
              type="button"
              classes="btn btn-wide flex flex-row justify-start text-left gap-x-6"
            >
              <PlaySquare />
              <span className="flex-1 shrink-0 pl-4">Join Match</span>
            </GameButton>
          </div>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
          <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] bg-base-100 translate-x-[-50%] translate-y-[-50%] rounded-box p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
            <AlertDialog.Title className="text-mauve12 mt-4 mb-12 pl-8 text-xl font-bold text-balance"></AlertDialog.Title>
            <AlertDialog.Description className="text-[15px] text-center leading-normal">
              {/* We require this to serve the best experience */}
              {/* <div className="font-bold text-left text-base px-8 alert alert-error">
                Your Match ID: {matchId}
              </div> */}
              <div className="card items-center shrink-0 my-4 w-full bg-base-100">
                <div className="text-xl text-left">
                  You need to select your players before you can join a match.
                </div>
                <label
                  htmlFor="id-game-entry-modal-close-button"
                  className="btn btn-primary btn-wide mt-6"
                >
                  Select Players
                </label>
                {/* You need to select your players using the button at the left panel
            of the screen to select your players. Then you can start the
            match. */}
              </div>
            </AlertDialog.Description>
            <div className="absolute top-8 right-4 flex justify-end gap-[25px]">
              <AlertDialog.Cancel asChild>
                <button
                  id="id-game-entry-modal-close-button"
                  title="Close profile dialog"
                  type="button"
                  className="btn size-12 rounded-full text-xl"
                  aria-label="Close"
                  ref={gameEntryModalCloseButton}
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
    );
  }

  const generateMatchId = () => {
    setMatchId(eightRandomNumber());
    const hash = SHA256(JSON.stringify(selectedPlayerList)).toString(enc.Hex);
    console.log("Player hash", hash);
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

  const depositErc20ToPortal = async (token: string, amount: number) => {
    try {
      if (rollups && provider) {
        const data = ethers.utils.toUtf8Bytes(
          `Deposited (${amount}) of ERC20 (${token}).`
        );
        //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const erc20PortalAddress = rollups.erc20PortalContract.address;
        const tokenContract = signer
          ? IERC20__factory.connect(token, signer)
          : IERC20__factory.connect(token, provider);

        // query current allowance
        const currentAllowance = await tokenContract.allowance(
          signerAddress,
          erc20PortalAddress
        );
        if (ethers.utils.parseEther(`${amount}`) > currentAllowance) {
          // Allow portal to withdraw `amount` tokens from signer
          const tx = await tokenContract.approve(
            erc20PortalAddress,
            ethers.utils.parseEther(`${amount}`)
          );
          const receipt = await tx.wait(1);
          const event = (
            await tokenContract.queryFilter(
              tokenContract.filters.Approval(),
              receipt.blockHash
            )
          ).pop();
          if (!event) {
            throw Error(
              `could not approve ${amount} tokens for DAppERC20Portal(${erc20PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
            );
          }
          //  else {
          //   setDepositSuccessful(true);
          // }
        }

        await rollups.erc20PortalContract.depositERC20Tokens(
          token,
          defaultDappAddress,
          ethers.utils.parseEther(`${amount}`),
          data
        );
      }
    } catch (e) {
      console.log(`${e}`);
    }
  };

  const handleJoinMatch = async () => {
    const token = "0xae7f61eCf06C65405560166b259C54031428A9C4";
    depositErc20ToPortal(token, amount);
    console.log("deposit complete");
    setIsSubmit(true);
    // construct the json payload to send to addInput
    const jsonPayload = {
      method: "accept_match",
      data: {
        match_id: joinMatchId,
        player: selectedPlayerList,
      },
    };
    // addInput(JSON.stringify(jsonPayload));
    // console.log(JSON.stringify(jsonPayload));

    const res = await addInput(JSON.stringify(jsonPayload));
    console.log(res);
    const receipt = await res?.wait(1);
    console.log(receipt);
    const event = receipt?.events?.find((e) => e.event === "InputAdded");
    console.log(event);

    if (event?.event === "InputAdded") {
      // set the match Id
      if (gameType === "duel") {
        updateCurrentMatchIds("duelMatchId", joinMatchId);
      }

      setOpen(false);
      toast.success("This match will start in 5 seconds.");
      toast.success("Good Luck");
    }
  };

  const handleMatchIdChange = (e) => {
    setJoinMatchId(Number(e.target.value));
    // Find the amount that matches this match Id
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        {/* <button
          type="button"
          className="hidden btn btn-block inline-flex h-[35px] items-center justify-center px-[15px] font-medium leading-none outline-none outline-0"
          //   disabled={!wallet}
        >
          Create Profile
        </button> */}
        {/* <div className="mt-8 px-8">
          <button
            type="button"
            className="btn flex flex-row gap-x-6"
            onClick={generateMatchId}
          >
            <PlusSquare />
            Create Match
          </button>
        </div> */}
        <div className="mt-8 px-8">
          {/* <button
            type="button"
            // onClick={openPlayerSelectionPanel}
            className="btn flex flex-row gap-x-6"
          >
            <PlaySquare />
            Join Match
          </button> */}
          <GameButton
            type="button"
            classes="btn btn-wide flex flex-row justify-start text-left gap-x-6"
          >
            <PlaySquare />
            <span className="flex-1 shrink-0 pl-4">Join Match</span>
          </GameButton>
        </div>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
        <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] bg-base-100 translate-x-[-50%] translate-y-[-50%] rounded-md p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
          <AlertDialog.Title className="text-mauve12 mt-4 mb-12 pl-8 text-xl font-bold text-balance">
            Join Match
          </AlertDialog.Title>
          <AlertDialog.Description className="text-[15px] text-center leading-normal">
            {/* We require this to serve the best experience */}
            {/* <div className="font-bold text-left text-base px-8 bg-base-100">
              Your Match ID: {matchId}
            </div> */}
            <form className="card-body w-full">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Match ID to Join</span>
                </label>
                <input
                  type="text"
                  placeholder="Match ID"
                  className="input input-bordered"
                  onChange={handleMatchIdChange}
                  required
                />
              </div>
              {/* <div className="form-control">
                <label className="label">
                  <span className="label-text">About yourself</span>
                </label>
                <textarea
                  className="textarea textarea-lg textarea-bordered text-base resize-none"
                  placeholder="Tell the world something about yourself"
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div> */}
              <div className="form-control mt-6">
                <GameButton
                  type="button"
                  classes="btn rounded-xl"
                  onClick={handleJoinMatch}
                >
                  {isSubmit ? <ButtonLoader /> : "Join Match"}
                </GameButton>
              </div>
            </form>
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
              {/* <div className="">
                Share this <b>match ID: {matchId}</b> with your opponent to join
                this match
              </div> */}
              {/* You need to select your players using the button at the left panel
              of the screen to select your players. Then you can start the
              match. */}
            </div>
          </AlertDialog.Description>
          <div className="absolute top-8 right-4 flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <GameButton
                title="Close profile dialog"
                type="button"
                classes="btn size-12 rounded-full text-xl"
                aria-label="Close"
                ref={gameEntryModalCloseButton}
              >
                <LucideX size={64} />
              </GameButton>
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
  );
};
