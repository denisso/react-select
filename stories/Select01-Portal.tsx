import Select from "./Components/Select01";
import Menu from "./Components/Select01/Menu";
import Option from "./Components/Select01/Option";
import Button from "./Components/Select01/Button";
import styles from "./Select01-Portal.module.scss";

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

export default CustomSelect;
