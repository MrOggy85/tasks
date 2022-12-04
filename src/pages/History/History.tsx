import { useNavigate } from 'react-router-dom';
import { FiCheckSquare, FiEdit, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { isSameDay } from 'date-fns';
import { Container, ListGroup, Spinner } from 'react-bootstrap';
import { getAll, remove, done, unDone } from '../../core/tasks/taskSlice';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';
import Button from '../../components/Button/Button';
import IdText from '../../components/IdText';
import styles from './History.module.css';

function sortDate(
  aDate: string | undefined,
  bDate: string | undefined,
  sortOrder: 'asc' | 'desc',
) {
  const aD = sortOrder === 'asc' ? aDate : bDate;
  const bD = sortOrder === 'asc' ? bDate : aDate;
  if (!aD && !bD) {
    return 0;
  }
  if (!aD) {
    return sortOrder === 'asc' ? 1 : -1;
  }
  if (!bD) {
    return sortOrder === 'asc' ? -1 : 1;
  }
  return new Date(aD).getTime() - new Date(bD).getTime();
}

type ListGroupItemProps = {
  id: number;
  title: string;
  completionDate: string;
  loading: boolean;
  onDone: (id: number) => Promise<void>;
  onUnDone: (id: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  onEdit: (id: number) => Promise<void>;
};

const ListGroupItem = ({
  id,
  title,
  completionDate,
  loading,
  onDone,
  onUnDone,
  onEdit,
  onRemove,
}: ListGroupItemProps) => {
  return (
    <ListGroup.Item key={id}>
      <div className={styles.listGroupItem}>
        <div>
          <Button
            style={{ marginRight: 4 }}
            variant="light"
            type="button"
            disabled={loading}
            onClick={() => {
              if (completionDate) {
                onUnDone(id);
              } else {
                onDone(id);
              }
            }}
            content={<FiCheckSquare />}
          />

          {title}
        </div>

        <div>
          <Button
            style={{ marginRight: 4 }}
            variant="danger"
            type="button"
            disabled={loading}
            onClick={() => {
              onRemove(id);
            }}
            content={<FiTrash2 />}
          />
          <Button
            style={{ marginRight: 4 }}
            variant="light"
            type="button"
            disabled={loading}
            onClick={() => {
              onEdit(id);
            }}
            content={<FiEdit />}
          />

          <IdText id={id} />
        </div>
      </div>
    </ListGroup.Item>
  );
};

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const rawTasks = useAppSelector((x) => x.tasks.tasks);
  const loading = useAppSelector((x) => x.tasks.loadingAll);

  // const [sorting, setSorting] = useState<Sorting>('createdDate');
  // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const tasks = rawTasks
    .filter((x) => {
      if (!x.completionDate) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      return sortDate(a.completionDate, b.completionDate, 'desc');
    });

  const todaysTasks = tasks.filter(
    (x) =>
      x.completionDate && isSameDay(new Date(), new Date(x.completionDate)),
  );

  const previousTasks = tasks.filter(
    (x) =>
      x.completionDate && !isSameDay(new Date(), new Date(x.completionDate)),
  );
  // const overdueTasks = tasks.filter(
  //   (x) => x.endDate && isAfter(new Date(), new Date(x.endDate)),
  // );
  // const futureTasks = tasks.filter(
  //   (x) =>
  //     (x.endDate &&
  //       isBefore(new Date(), new Date(x.endDate)) &&
  //       !isSameDay(new Date(), new Date(x.endDate))) ||
  //     (x.startDate &&
  //       isBefore(new Date(), new Date(x.startDate)) &&
  //       !isSameDay(new Date(), new Date(x.startDate))),
  // );

  const onUpdate = async () => {
    await dispatch(getAll());
  };
  const onRemove = async (id: number) => {
    await dispatch(remove(id));
  };
  const onEdit = async (id: number) => {
    navigate(`/task/${id}`);
  };
  const onDone = async (id: number) => {
    await dispatch(done(id));
  };
  const onUnDone = async (id: number) => {
    await dispatch(unDone(id));
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <h2>History</h2>
      <Button
        style={{ marginBottom: 4 }}
        variant="success"
        type="button"
        disabled={loading}
        onClick={() => {
          onUpdate();
        }}
        content={
          loading ? <Spinner size="sm" animation={'border'} /> : <FiRefreshCw />
        }
      />

      <ListGroup>
        <h3>Today</h3>
        {todaysTasks.map((x) => {
          return (
            <ListGroupItem
              key={x.id}
              id={x.id}
              title={x.title}
              completionDate={x.completionDate || ''}
              loading={loading}
              onDone={onDone}
              onUnDone={onUnDone}
              onRemove={onRemove}
              onEdit={onEdit}
            />
          );
        })}
      </ListGroup>
      <ListGroup>
        <h3>Previous</h3>
        {previousTasks.map((x) => {
          return (
            <ListGroupItem
              key={x.id}
              id={x.id}
              title={x.title}
              completionDate={x.completionDate || ''}
              loading={loading}
              onDone={onDone}
              onUnDone={onUnDone}
              onRemove={onRemove}
              onEdit={onEdit}
            />
          );
        })}
      </ListGroup>
    </Container>
  );
};

export default Home;
