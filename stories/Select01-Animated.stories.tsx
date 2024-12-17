import type { Meta, StoryObj } from "@storybook/react";
import Select01 from "./Select01-Animated";

const meta: Meta<typeof Select01> = {
  title: "Examples/Select01- Animated",
  component: Select01,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    animate: {
      control: { type: 'boolean' },
      description: 'Toggle animation',
      defaultValue: false,
    },
    duration: {
      control: { type: 'number', min: 500, max: 2000, step: 100 },
      description: 'Duration of the animation in milliseconds',
      defaultValue: 1000, 
      if: { arg: 'animate', truthy: true }
    },
    easing: {
      control: { type: 'select' },
      options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
      description: 'Easing function for the animation',
      defaultValue: 'ease',
      if: { arg: 'animate', truthy: true },
    },
    options: {
      control: "object",
      description: "Array of items with label and value",
      defaultValue: [
        { label: "Option 1", value: "value1" },
        { label: "Option 2", value: "value2" },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { label: "Option 1", value: "value1" },
      { label: "Option 2", value: "value2" },
    ],
    animate: true, 
    duration: 1000,
    easing: 'ease',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "200px", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      source: {
        code: `
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

// Usage
<CustomSelect
  animate={true}
  duration={500}
  easing="linear"
  options={[
    { label: 'Option 1', value: 'value1' },
    { label: 'Option 2', value: 'value2' },
  ]}
/>
  `,
      },
    },
  },
};
