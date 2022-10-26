import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import {
  FiTrash2,
  FiEdit,
  FiCheckSquare,
  FiSquare,
  FiRepeat,
  FiRefreshCw,
} from 'react-icons/fi';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { Container, InputGroup, Spinner, Table } from 'react-bootstrap';
import getPrio from '../../core/getPrio';
import { getAll, remove, done, unDone } from '../../core/tasks/taskSlice';
import Pill from '../../components/Pill';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';
import Select from '../../components/Select';
import Button from '../../components/Button/Button';
import DateText from '../../components/DateText';
import { RootState } from '../../core/redux/store';

type ListOfTasksProps = {
  title: string;
  tasks: RootState['tasks']['tasks'];
  loading: boolean;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
  onDone: (id: number) => void;
  onUnDone: (id: number) => void;
};

const ListOfTasks = ({
  title,
  tasks,
  loading,
  onRemove,
  onEdit,
  onDone,
  onUnDone,
}: ListOfTasksProps) => {
  return (
    <>
      <h2>{title}</h2>
      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: 6 }}>#</th>
            <th style={{ width: 5 }}>Title</th>
            <th style={{ width: 5 }}>Start</th>
            <th style={{ width: 5 }}>End</th>
            <th style={{ width: 5 }}></th>
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
                    style={{ marginRight: 4 }}
                    variant="danger"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      onRemove(x.id);
                    }}
                    content={<FiTrash2 />}
                  />
                  <Button
                    style={{ marginRight: 4 }}
                    variant="light"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      onEdit(x.id);
                    }}
                    content={<FiEdit />}
                  />
                  <Button
                    style={{ marginRight: 4 }}
                    variant="light"
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
                <td>{x.title}</td>
                <td>
                  {x.startDate ? <DateText date={x.startDate} /> : 'None'}
                </td>
                <td>{x.endDate ? <DateText date={x.endDate} /> : 'None'}</td>
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
    </>
  );
};

type Sorting =
  | 'createdDate'
  | 'updatedDate'
  | 'title'
  | 'startDate'
  | 'endDate'
  | 'priority';

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

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const rawTasks = useAppSelector((x) => x.tasks.tasks);
  const loading = useAppSelector((x) => x.tasks.loading);

  const [sorting, setSorting] = useState<Sorting>('createdDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const tasks = rawTasks
    .filter((x) => {
      if (x.completionDate && x.repeat) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sorting) {
        case 'startDate':
          return sortDate(a.startDate, b.startDate, sortOrder);
        case 'endDate':
          return sortDate(a.endDate, b.endDate, sortOrder);
        case 'updatedDate':
          return sortDate(a.updatedAt, b.updatedAt, sortOrder);

        case 'priority':
          return sortOrder === 'asc'
            ? a.priority - b.priority
            : b.priority - a.priority;

        case 'title':
          return sortOrder === 'asc'
            ? a.title.charCodeAt(0) - b.title.charCodeAt(0)
            : b.title.charCodeAt(0) - a.title.charCodeAt(0);

        case 'createdDate':
        default:
          return sortDate(a.createdAt, b.createdAt, sortOrder);
      }
    });

  const todaysTasks = tasks.filter(
    (x) => x.endDate && isSameDay(new Date(), new Date(x.endDate)),
  );
  const overdueTasks = tasks.filter(
    (x) => x.endDate && isAfter(new Date(), new Date(x.endDate)),
  );
  const futureTasks = tasks.filter(
    (x) =>
      x.endDate &&
      isBefore(new Date(), new Date(x.endDate)) &&
      !isSameDay(new Date(), new Date(x.endDate)),
  );

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

      <InputGroup style={{ marginBottom: 5 }}>
        <Select
          label="Sorting"
          emptyOptionLabel="Select Sorting"
          options={(
            [
              'createdDate',
              'updatedDate',
              'title',
              'startDate',
              'endDate',
              'priority',
            ] as Sorting[]
          ).map((x) => ({
            label: x,
            value: x,
          }))}
          value={sorting}
          setValue={(v) => setSorting(v as Sorting)}
        />
        <Select
          label="Order"
          emptyOptionLabel="Select Order"
          options={['asc' as const, 'desc' as const].map((x) => ({
            label: x,
            value: x,
          }))}
          value={sortOrder}
          setValue={(v) => setSortOrder(v as any)}
        />
      </InputGroup>

      <ListOfTasks
        title="Overdue"
        tasks={overdueTasks}
        loading={loading}
        onRemove={onRemove}
        onEdit={onEdit}
        onDone={onDone}
        onUnDone={onUnDone}
      />

      <ListOfTasks
        title="Today"
        tasks={todaysTasks}
        loading={loading}
        onRemove={onRemove}
        onEdit={onEdit}
        onDone={onDone}
        onUnDone={onUnDone}
      />
      <ListOfTasks
        title="Coming Up"
        tasks={futureTasks}
        loading={loading}
        onRemove={onRemove}
        onEdit={onEdit}
        onDone={onDone}
        onUnDone={onUnDone}
      />
    </Container>
  );
};

export default Home;
