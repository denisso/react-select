import React from "react";
import classNames from "classnames";
import Select, {
  Menu,
  Option,
  Button,
  ParamsManager,
  State,
} from "./Components/Select01";
import styles from "./Select01.module.scss";

const CustomButton = () => {
  const [open, setOpen] = React.useState(false);
  const [finish, setFinish] = React.useState(true);
  const onAnimate = (animate: State["animate"]) => {
    setFinish(animate?.state == "finish");
  };
  const onOpen = (open: State["open"]) => {
    setOpen(open);
  };
  return (
    <>
      <Button
        placeholder="placeholder"
        className={classNames(
          styles.button,
          !finish || (open && finish) ? styles.open : ""
        )}
      />
      <ParamsManager onAnimate={onAnimate} onOpen={onOpen} />
    </>
  );
};

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  options: OptionType[];
  easing: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  duration: number;
  animate: boolean;
};

const CustomSelect = ({
  options,
  animate,
  easing = "linear",
  duration,
}: Props) => {
  return (
    <Select className={styles.select}>
      <CustomButton />
      <Menu
        className={styles.menu}
        emptyValue={"zero"}
        portal={true}
        styles={{ open: styles.open }}
        animate={animate ? { t: duration, fn: easing } : null}
      >
        <Option
          label={"empty option"}
          value={"zero"}
          className={styles.option}
        />
        {options.map(({ label, value }) => (
          <Option
            label={label}
            value={value}
            key={value}
            className={styles.option}
            styles={{ selected: styles.selected }}
          />
        ))}
      </Menu>
    </Select>
  );
};

export default CustomSelect;
