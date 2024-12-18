import Select, { Menu, Option, Button } from "./Components/Select01";
import styles from "./Select01.module.scss";

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
  portal: boolean;
};

const CustomSelect = ({ options, portal }: Props) => {
  return (
    <Select className={styles.select}>
      <CustomButton />
      <Menu
        className={styles.menu}
        emptyValue={"zero"}
        portal={portal}
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

export default CustomSelect;
