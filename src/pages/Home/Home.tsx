import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiFilter } from 'react-icons/fi';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { Container, InputGroup, Spinner } from 'react-bootstrap';
import { getAll, remove, done, unDone } from '../../core/tasks/taskSlice';
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

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const rawTasks = useAppSelector((x) => x.tasks.tasks);
  const loading = useAppSelector((x) => x.tasks.loading);

  const [sorting, setSorting] = useState<Sorting>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSorting, setShowSorting] = useState(false);

  const isMobileScreen = window.screen.width < 400;

  const tasks = rawTasks
    .filter((x) => {
      if (x.completionDate) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      console.log('sorting', sorting);
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
      <div>
        <Button
          style={{ marginBottom: 4, marginRight: 4 }}
          variant="outline-success"
          type="button"
          disabled={loading}
          onClick={() => {
            onUpdate();
          }}
          content={
            loading ? (
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
            loading={loading}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            cardStyle={{ border: '1px solid #c16e5f', color: '#c16e5f' }}
          />
          <CardTasks
            title="Today"
            tasks={todaysTasks}
            loading={loading}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
          />
          <CardTasks
            title="Coming Up"
            tasks={futureTasks}
            loading={loading}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            cardStyle={{ color: '#919295' }}
          />
          <CardTasks
            title="Someday"
            tasks={somedayTasks}
            loading={loading}
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
            loading={loading}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
            tableStyle={{ border: '1px solid #c16e5f', color: '#c16e5f' }}
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
            tableStyle={{ color: '#919295' }}
          />

          <ListOfTasks
            title="Someday"
            tasks={somedayTasks}
            loading={loading}
            onRemove={onRemove}
            onEdit={onEdit}
            onDone={onDone}
            onUnDone={onUnDone}
          />
        </>
      )}
    </Container>
  );
};

export default Home;
