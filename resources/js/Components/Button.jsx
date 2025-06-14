import React from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import DangerButton from "./DangerButton";
import GhostButton from "./GhostButton";

const Button = ({ variant, ...props }) => {
  switch (variant) {
    case "primary":
      return <PrimaryButton {...props} />;
    case "secondary":
      return <SecondaryButton {...props} />;
    case "danger":
      return <DangerButton {...props} />;
    default:
      return <GhostButton {...props} />;
  }
};

export default Button;