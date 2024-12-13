import type { Meta, StoryObj } from "@storybook/react";
import Select01 from "./Select01-MultiSelect";

const meta: Meta<typeof Select01> = {
  title: "Examples/Select01 - MultiSelect",
  component: Select01,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
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
import Select, {
  Menu,
  Option,
  ButtonMulti,
  ButtonCloseMulti,
  Tag,
  TagClose,
  ParamsManager,
  State,
} from "./Components/Select01";
import classNames from "classnames";
import styles from "./Select01.module.scss";

const CustomButton = () => {
  const [empty, setEmpty] = React.useState(true);
  const onOptions = (options: State["options"]) => {
    setEmpty(options.has("zero") || !options.size);
    console.log("CustomButton onOpen", options);
  };
  return (
    <>
      <ButtonMulti
        placeholder="placeholder"
        className={classNames(
          styles.button,
          styles["button-multi"],
          empty ? styles.plcaholder : ""
        )}
        styles={{ open: styles.open }}
        tag={
          <Tag
            className={styles.tag}
            button={<TagClose label={"X"} className={styles["tag-close"]} />}
          />
        }
      />
      <ParamsManager onOptions={onOptions} />
    </>
  );
};

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  options: OptionType[];
};

const CustomMenu = ({ options }: Props) => {
  return (
    <>
      <Menu
        className={styles.menu}
        emptyValue={"zero"}
        portal={true}
        styles={{ open: styles.open }}
      >
        <Option
          value={"zero"}
          className={classNames(styles.option, styles.empty)}
        >
          <ButtonCloseMulti
            label={"Close menu"}
            className={styles["button-close"]}
          />
        </Option>
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
    </>
  );
};

const CustomSelect = ({ options }: Props) => {
  return (
    <Select className={styles.select}>
      <CustomButton />
      <CustomMenu options={options} />
    </Select>
  );
};

export default CustomSelect;


// Usage
<CustomSelect
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
