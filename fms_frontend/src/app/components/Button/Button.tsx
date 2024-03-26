"use client";

import "./Button.css";
import classNames from "classnames";

interface IButton {
  type?: string | "button";
  onClick?: any;
  id?: string;
  classes?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  props?: any;
}

type ButtonProps = {
  buttonProps: IButton;
};

export const GameButton: React.FC<IButton> = ({
  type,
  id,
  classes,
  disabled,
  onClick,
  children,
  props,
}) => {
  // const buttonClass = classNames("glow-button btn-anim", classes);
  const buttonClass = classNames("btn-glass", classes);

  return (
    <button
      type={type}
      id={id}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <div className="inner-color">{children}</div>
    </button>
  );
};
