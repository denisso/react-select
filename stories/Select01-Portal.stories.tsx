import type { Meta, StoryObj } from "@storybook/react";
import Select01 from "./Select01-Portal";

const meta: Meta<typeof Select01> = {
  title: "Examples/Select01",
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
const CustomButton = () => {
  return (
    <Button
      placeholder="placeholder"
      className={styles.button}
      styles={{ open: styles.open }}
    />
  );
};

type OptionType = {
  label: string;
  value: string;
};

type Props = {
  options: OptionType[];
};

const CustomSelect = ({ options }: Props) => {
  return (
    <Select className={styles.select}>
      <CustomButton />
      <Menu
        className={styles.menu}
        emptyValue={"zero"}
        portal={true}
        styles={{ open: styles.open }}
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
