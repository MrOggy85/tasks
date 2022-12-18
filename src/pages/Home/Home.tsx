import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiFilter, FiDownloadCloud } from 'react-icons/fi';
import { format, isAfter, isBefore, isSameDay, add } from 'date-fns';
import { Container, InputGroup, Spinner } from 'react-bootstrap';
import {
  getAll,
  remove,
  done,
  unDone,
  update,
} from '../../core/tasks/taskSlice';
import { useAppDispatch } from '../../core/redux/useAppDispatch';
import { useAppSelector } from '../../core/redux/useAppSelector';
import Select from '../../components/Select';
import Button from '../../components/Button/Button';
import ListOfTasks from './ListOfTasks';
import CardTasks from './CardTasks';

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

type Duration = Parameters<typeof add>[1];

function addDateDuration(dateISOstring: string, duration: Duration) {
  const date = new Date(dateISOstring);
  const newDate = add(date, duration);
  return newDate.toISOString();
}

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const rawTasks = useAppSelector((x) => x.tasks.tasks);
  const loadingAll = useAppSelector((x) => x.tasks.loadingAll);

  const [sorting, setSorting] = useState<Sorting>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSorting, setShowSorting] = useState(false);

  const [lastRefresh, setLastRefresh] = useState(new Date());

  const isMobileScreen = window.screen.width < 400;

  const tasks = rawTasks
    .filter((x) => {
      if (x.completionDate) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sorting) {
        default:
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
          return sortDate(a.createdAt, b.createdAt, sortOrder);
      }
    });

  const now = new Date();

  const todaysTasks = tasks.filter(
    (x) => x.endDate && isSameDay(now, new Date(x.endDate)),
  );

  const overdueTasks = tasks.filter(
    (x) =>
      x.endDate &&
      isAfter(now, new Date(x.endDate)) &&
      !isSameDay(now, new Date(x.endDate)),
  );
  const futureTasks = tasks.filter(
    (x) =>
      (x.endDate &&
        isBefore(now, new Date(x.endDate)) &&
        !isSameDay(now, new Date(x.endDate))) ||
      (x.startDate &&
        isBefore(now, new Date(x.startDate)) &&
        !isSameDay(now, new Date(x.startDate))),
  );

  const somedayTasks = tasks.filter((x) => !x.startDate && !x.endDate);
  const onUpdate = async () => {
    await dispatch(getAll());
  };

  const onRefresh = () => {
    setLastRefresh(new Date());
  };

  useEffect(() => {
    if (!loadingAll) {
      setLastRefresh(new Date());
    }
  }, [loadingAll]);

  const onRemove = async (id: number) => {
    const yes = confirm(`Delete ${id}?`);
    if (yes) {
      await dispatch(remove(id));
    }
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

  const onPlusOneDay = async (id: number) => {
    const task = tasks.find((x) => x.id === id);
    if (!task) {
      alert(`No Task found with id: ${id}`);
      return;
    }

    await dispatch(
      update({
        ...task,
        tagIds: task.tags.map((tag) => tag.id),
        startDate: task.startDate
          ? addDateDuration(task.startDate, { days: 1 })
          : undefined,
        endDate: task.endDate
          ? addDateDuration(task.endDate, { days: 1 })
          : undefined,
      }),
    );
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <div>
        <Button
          style={{ marginBottom: 4, marginRight: 4 }}
          variant="outline-success"
          type="button"
          disabled={loadingAll}
          onClick={() => {
            onUpdate();
          }}
          content={
            loadingAll ? (
              <Spinner size="sm" animation={'border'} />
            ) : (
              <FiDownloadCloud />
            )
          }
        />
        <Button
          style={{ marginBottom: 4, marginRight: 4 }}
          variant="outline-success"
          type="button"
          disabled={loadingAll}
          onClick={() => {
            onRefresh();
          }}
          content={
            loadingAll ? (
              <Spinner size="sm" animation={'border'} />
            ) : (
              <FiRefreshCw />
            )
          }
        />
        <Button
          style={{ marginBottom: 4 }}
          variant={showSorting ? 'secondary' : 'outline-secondary'}
          type="button"
          onClick={() => {
            setShowSorting(!showSorting);
          }}
          content={<FiFilter />}
        />
        <p style={{ margin: 0 }}>
          Last refresh:{' '}
          <span style={{ fontSize: '1.1rem', fontWeight: 300 }}>
            {format(lastRefresh, 'yyyy-MM-dd')}
          </span>
          <span style={{ fontSize: '1.3rem', marginLeft: '0.2rem' }}>
            {format(lastRefresh, 'HH:mm:ss')}
          </span>
        </p>
      </div>

      {showSorting && (
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
            setValue={(v) => setSortOrder(v as 'asc' | 'desc')}
          />
        </InputGroup>
      )}

      {isMobileScreen ? (
        <>
          <CardTasks
            title="Overdue"
            tasks={overdueTasks}
            loading={loadingAll}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            cardStyle={{ border: '1px solid #c16e5f', color: '#c16e5f' }}
          />
          <CardTasks
            title="Today"
            tasks={todaysTasks}
            loading={loadingAll}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
          />
          <CardTasks
            title="Coming Up"
            tasks={futureTasks}
            loading={loadingAll}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            cardStyle={{ color: '#919295' }}
          />
          <CardTasks
            title="Someday"
            tasks={somedayTasks}
            loading={loadingAll}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
          />
        </>
      ) : (
        <>
          <ListOfTasks
            title="Overdue"
            tasks={overdueTasks}
            loading={loadingAll}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            onPlusOneDay={onPlusOneDay}
            tableStyle={{
              border: '1px solid #c16e5f',
              color: '#c16e5f',
              boxShadow: '0px 1px 5px 0px #c16e5f',
            }}
          />

          <ListOfTasks
            title="Today"
            tasks={todaysTasks}
            loading={loadingAll}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            onPlusOneDay={onPlusOneDay}
            tableStyle={{
              border: '1px solid #5f73c1',
              color: '#5f73c1',
              boxShadow: '0px 1px 5px 0px #5f73c1',
            }}
          />

          <ListOfTasks
            title="Coming Up"
            tasks={futureTasks}
            loading={loadingAll}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            onPlusOneDay={onPlusOneDay}
            tableStyle={{
              color: '#919295',
              display: 'block',
              maxHeight: '30vw',
              overflow: 'auto',
            }}
          />

          <ListOfTasks
            title="Someday"
            tasks={somedayTasks}
            loading={loadingAll}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            onPlusOneDay={onPlusOneDay}
            tableStyle={{
              border: '1px solid #adb5bd',
              boxShadow: '0px 1px 5px 0px #adb5bd',
            }}
          />
        </>
      )}
    </Container>
  );
};

export default Home;
