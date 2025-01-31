# Fully customizable react select control
A highly flexible and customizable React select component, supporting multiselect functionality, animations, and an optional portal for menu options.

The demo storybook is available at the [select-md.vercel.app](https://select-md.vercel.app/)

**Features**:
-  **Multiselect**: Allows selecting multiple options.
-  **Animation**: Smooth transitions for menu interactions.
-  **Optional Portal**: Menu options can be rendered outside of the DOM hierarchy, improving UI performance.
  
# Example code:

```javascript
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
```
