"use client";

import { ethers } from "ethers";
import { useRef, useState } from "react";
import { useRollups } from "../useRollups";
import { IInputProps } from "../Home";
import { usePeepsContext } from "../context";
import toast from "react-hot-toast";
import { CustomToastUI } from "./ToastUI";

const PostForm: React.FC<IInputProps> = (props) => {
  const { currentUser } = usePeepsContext();
  // const [input, setInput] = useState<string>("");
  const [hexInput, setHexInput] = useState<boolean>(false);
  const rollups = useRollups(props.dappAddress);
  const postTextField = useRef(null);
  const [postText, setPostText] = useState<string>("");

  const addInput = async (str: string) => {
    if (rollups) {
      try {
        let payload = ethers.utils.toUtf8Bytes(str);
        if (hexInput) {
          payload = ethers.utils.arrayify(str);
        }
        return await rollups.inputContract.addInput(props.dappAddress, payload);
        // const tx =
        // console.log(tx);
        // const receipt = await tx.wait(1);
        // console.log(receipt);
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const handlePost = async () => {
    // construct the json payload to send to addInput
    const jsonPayload = JSON.stringify({
      method: "createPost",
      data: {
        username: currentUser[0].username,
        message: postText,
      },
    });
    const res = await addInput(JSON.stringify(jsonPayload));
    console.log(res);
    const receipt = await res?.wait(1);
    console.log(receipt);
    const event = receipt?.events?.find((e) => e.event === "InputAdded");
    console.log(event);

    // toast.custom((t) => (
    //   <CustomToastUI
    //     t={t}
    //     message={"Post successfully created"}
    //   ></CustomToastUI>
    // ));
    toast.success("Post created successfully");

    // wait for confirmation
    // const receipt = await tx.wait(1);
    // console.log(JSON.stringify(jsonPayload));
  };

  return (
    <div className="bg-base-200 rounded-box focus-within:ring-2 focus-within:ring-primary">
      <textarea
        placeholder="Write something"
        className="textarea textarea-lg border-0 w-full resize-none bg-transparent focus:outline-0"
        ref={postTextField}
        onChange={(e) => setPostText(e.target.value)}
      ></textarea>
      <div className="flex flex-row px-2 py-2">
        <span className="flex-1"></span>
        <button
          title="Submit post"
          type="button"
          disabled={postText.length < 1 || !rollups}
          className="flex-grow-0 btn btn-sm btn-primary rounded-xl disabled:btn-disabled"
          onClick={handlePost}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostForm;
