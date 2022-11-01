import styles from './Pill.module.css';

type Props = {
  name: string;
  bgColor: string;
  textColor: string;
};

const Pill = ({ name, bgColor, textColor }: Props) => {
  return (
    <div
      className={styles.pill}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {name}
    </div>
  );
};

export default Pill;
