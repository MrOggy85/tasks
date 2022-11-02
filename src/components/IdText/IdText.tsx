import styles from './IdText.module.css';

type Props = {
  id: number;
};

const IdText = ({ id }: Props) => {
  return (
    <span className={styles.idText} style={{ color: '#666', fontSize: 11 }}>
      ID: {id}
    </span>
  );
};

export default IdText;
