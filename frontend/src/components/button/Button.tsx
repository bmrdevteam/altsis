/**
 * @file button component
 *
 * @author seedlessapple <luminousseedlessapple@gmail.com>
 *
 * -------------------------------------------------------
 *
 * IN PRODUCTION
 * - button component
 *
 * -------------------------------------------------------
 *
 * IN MAINTENANCE
 *
 * -------------------------------------------------------
 *
 * IN DEVELOPMENT
 *
 * -------------------------------------------------------
 *
 * DEPRECATED
 *
 * -------------------------------------------------------
 *
 * NOTES
 *
 */

import { useState } from "react";
import style from "./button.module.scss";

type Props = {
  children?: string;
  onClick?: any;
  type?: "ghost" | "solid" | "hover";
  round?: boolean;
  disabled?: boolean;
  disableOnclick?: boolean;
  styles?: object;
};

/**
 * Button component
 *
 * @param {()=>any} onClick function on click
 * @param {"ghost" | "solid" | "hover"} type - determines the button type "ghost" - hollow button with borders "solid" - solid button(default) "hover" - button with only text
 * @param {boolean} round - button will have a round edge
 * @param {boolean} disabled - button will be disabled
 * @param {boolean} disableOnclick - if true, the button will only be allowed to be pressed once
 * @param {object} styles - {} a style object to gain more control
 * 
 * @returns {JSX.Element} Button component
 * 
 * @example
 <Button
    type={"ghost"}
    styles={{
      borderRadius: "4px",
      height: "32px",
      boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
    }}
    onClick={() => {
      myFunction()
    }}
>
  foo
</Button>
 * 
 * @version 2.1 added disableOnclick function to gain more control 
 * @version 2.0 added a disabled class
 * @version 1.1 changed how the styles behave on the component
 * @version 1.0 initial version 
 */

const Button = ({
  children,
  onClick,
  type,
  round,
  disabled,
  disableOnclick,
  styles,
}: Props) => {
  // button state
  const [disable, setDisable] = useState<boolean>(false);

  // button class
  let btnClass = style.btn;

  //ghost class
  if (type === "ghost") {
    btnClass += " " + style.ghost;
  }

  //hover class
  if (type === "hover") {
    btnClass += " " + style.hover;
  }

  //round class
  if (round) {
    btnClass += " " + style.round;
  }

  //disabled class
  if (disabled || disable) {
    btnClass += " " + style.disabled;
  }

  //return button component
  return (
    <div
      className={`${btnClass} `}
      style={styles}
      onClick={(e) => {
        if (!disable && !disabled) {
          onClick && onClick(e);
        }
        if (disableOnclick && !disabled && !disable) {
          setDisable(true);
        }
      }}
    >
      {children}
    </div>
  );
};

export default Button;
