import Select from "./Components/Select01";
import Menu from "./Components/Select01/Menu";
import Option from "./Components/Select01/Option";
import Button from "./Components/Select01/Button";
import styles from "./Select01.module.scss";
import ParamsManager from "./Components/Select01/ParamsManager";
import { IDType } from "./Components/Select01/Context";

const CustomButton = () => {
  const onChange = (id: IDType) => {
    console.log("CustomButton", id);
  };
  return (
    <>
      <Button
        placeholder="placeholder"
        className={styles.button}
        styles={{ open: styles.open }}
      />
      <ParamsManager onChange={onChange} />
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
  const onChange = (id: IDType) => {
    console.log("CustomMenu", id);
  };
  return (
    <>
      <ParamsManager onChange={onChange} />
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
