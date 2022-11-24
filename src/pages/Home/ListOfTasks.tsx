import { Table } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import {
  FiTrash2,
  FiEdit,
  FiCheckSquare,
  FiSquare,
  FiRepeat,
} from 'react-icons/fi';
import { isAfter } from 'date-fns';
import getPrio from '../../core/getPrio';
import Pill from '../../components/Pill';
import DateText from '../../components/DateText';
import Button from '../../components/Button/Button';
import { RootState } from '../../core/redux/store';
import styles from './Home.module.css';

type Props = {
  title: string;
  tasks: RootState['tasks']['tasks'];
  loading: boolean;
  tableStyle?: React.CSSProperties;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
  onDone: (id: number) => void;
  onUnDone: (id: number) => void;
};

const ListOfTasks = ({
  title,
  tasks,
  loading,
  tableStyle,
  onRemove,
  onEdit,
  onDone,
  onUnDone,
}: Props) => {
  return (
    <>
      {tasks.length > 0 ? (
        <Table bordered className={styles.table} style={tableStyle}>
          <thead>
            <tr>
              <th style={{ width: '18%' }}>{title}</th>
              <th>Title</th>
              <th style={{ width: '8%' }}>Start</th>
              <th style={{ width: '8%' }}>End</th>
              <th style={{ width: '15%' }}></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((x) => {
              const prio = getPrio(x.priority);
              const notStarted = x.startDate
                ? isAfter(new Date(x.startDate), new Date())
                : false;

              return (
                <tr key={x.id} style={{ opacity: notStarted ? 0.5 : 1 }}>
                  <td>
                    <Button
                      style={{ marginRight: 4, marginBottom: 4 }}
                      variant="outline-danger"
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        onRemove(x.id);
                      }}
                      content={<FiTrash2 />}
                    />
                    <Button
                      style={{ marginRight: 4, marginBottom: 4 }}
                      variant="outline-success"
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        onEdit(x.id);
                      }}
                      content={<FiEdit />}
                    />
                    <Button
                      style={{ marginRight: 4, marginBottom: 4 }}
                      variant="outline-primary"
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        if (x.completionDate) {
                          onUnDone(x.id);
                        } else {
                          onDone(x.id);
                        }
                      }}
                      content={
                        x.repeat ? (
                          <FiRepeat />
                        ) : x.completionDate ? (
                          <FiCheckSquare />
                        ) : (
                          <FiSquare />
                        )
                      }
                    />
                    <span style={{ color: '#666', fontSize: 11 }}>
                      ID: {x.id}
                    </span>
                  </td>
                  <td>
                    <p className={styles.title}>{x.title}</p>
                    <p className={styles.description}>{x.description}</p>
                  </td>
                  <td>{x.startDate ? <DateText date={x.startDate} /> : '-'}</td>
                  <td>{x.endDate ? <DateText date={x.endDate} /> : '-'}</td>
                  <td>
                    <Badge text={prio.text} bg={prio.bg}>
                      {prio.content}
                    </Badge>
                    {x.repeat ? (
                      <Badge style={{ marginLeft: 4 }} bg="success">
                        <FiRepeat />
                      </Badge>
                    ) : (
                      ''
                    )}
                    {x.tags.map((t) => (
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
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

export default ListOfTasks;
