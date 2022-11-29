import { Card, Spinner } from 'react-bootstrap';
import {
  FiTrash2,
  FiEdit,
  FiCheckSquare,
  FiSquare,
  FiRepeat,
} from 'react-icons/fi';
import { RootState } from '../../core/redux/store';
import Button from '../../components/Button/Button';
import DateText from '../../components/DateText';
import Pill from '../../components/Pill';
import styles from './Home.module.css';

type CardTask = {
  loading: boolean;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
  onDone: (id: number) => void;
  onUnDone: (id: number) => void;
  cardStyle?: React.CSSProperties;
} & RootState['tasks']['tasks'][0];

const CardTask = ({
  id,
  title,
  description,
  completionDate,
  startDate,
  endDate,
  repeat,
  tags,
  loading,
  onRemove,
  onEdit,
  onDone,
  onUnDone,
  cardStyle,
}: CardTask) => {
  return (
    <Card style={{ marginBottom: 5, ...cardStyle }}>
      <Card.Body style={{ padding: '0.5em' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p className={styles.title}>{title}</p>
            <p className={styles.description}>{description}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {startDate !== endDate && (
              <div className={styles.mobileDate}>
                {startDate ? <DateText date={startDate} /> : '-'}
              </div>
            )}
            <div className={styles.mobileDate}>
              {endDate ? <DateText date={endDate} /> : '-'}
            </div>
            {tags.map((t) => (
              <div
                key={t.id}
                style={{ marginLeft: 4, display: 'inline-block' }}
              >
                <Pill
                  name={t.name}
                  bgColor={t.bgColor}
                  textColor={t.textColor}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          style={{ marginRight: 4, marginBottom: 4 }}
          variant="outline-danger"
          type="button"
          disabled={loading}
          onClick={() => {
            onRemove(id);
          }}
          content={<FiTrash2 />}
        />
        <Button
          style={{ marginRight: 4, marginBottom: 4 }}
          variant="outline-success"
          type="button"
          disabled={loading}
          onClick={() => {
            onEdit(id);
          }}
          content={<FiEdit />}
        />
        <Button
          style={{ marginRight: 4, marginBottom: 4 }}
          variant="outline-primary"
          type="button"
          disabled={loading}
          onClick={() => {
            if (completionDate) {
              onUnDone(id);
            } else {
              onDone(id);
            }
          }}
          content={
            repeat ? (
              <FiRepeat />
            ) : completionDate ? (
              <FiCheckSquare />
            ) : (
              <FiSquare />
            )
          }
        />
        {loading && (
          <div>
            <Spinner animation="grow" />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

type Props = {
  title: string;
  tasks: RootState['tasks']['tasks'];
  loading: boolean;
  cardStyle?: React.CSSProperties;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
  onDone: (id: number) => void;
  onUnDone: (id: number) => void;
};

const CardTasks = ({
  title,
  tasks,
  loading,
  cardStyle,
  onRemove,
  onEdit,
  onDone,
  onUnDone,
}: Props) => {
  return (
    <>
      {tasks.length > 0 ? (
        <>
          <div>
            <b>{title}</b>
            {loading && (
              <>
                {' '}
                <Spinner animation={'border'} variant="success" size="sm" />
              </>
            )}
          </div>
          {tasks.map((x) => {
            return (
              <CardTask
                key={x.id}
                {...x}
                loading={loading}
                onRemove={onRemove}
                onEdit={onEdit}
                onDone={onDone}
                onUnDone={onUnDone}
                cardStyle={cardStyle}
              />
            );
          })}
        </>
      ) : loading ? (
        <div>
          <b>{title}</b> -{' '}
          <Spinner animation={'border'} variant="success" size="sm" />
        </div>
      ) : (
        <p>
          <b>{title}</b> - No Tasks
        </p>
      )}
    </>
  );
};

export default CardTasks;
