import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import styles from './App.module.css';
import Home from './pages/Home';
import Task from './pages/Task';
import TagList from './pages/Tag/List';
import TagDetail from './pages/Tag/Detail';
import Login from './pages/Login';
import History from './pages/History';

type LinkItemProps = {
  url: string;
  text: string;
  pathname: string;
};

const LinkItem = ({ url, text, pathname }: LinkItemProps) => {
  return pathname === url ? (
    <p className={styles.active}>{text}</p>
  ) : (
    <Link
      className={`${styles.link} ${pathname === url ? 'active' : ''}`}
      to={url}
    >
      {text}
    </Link>
  );
};

function App() {
  const location = useLocation();

  return (
    <>
      <Nav variant="tabs">
        <NavItem>
          <LinkItem url="/" text="Home" pathname={location.pathname} />
        </NavItem>
        <NavItem>
          <LinkItem
            url="/task/0"
            text="New Task"
            pathname={location.pathname}
          />
        </NavItem>
        <NavItem>
          <LinkItem url="/tag" text="Tags" pathname={location.pathname} />
        </NavItem>
        <NavItem>
          <LinkItem url="/login" text="Login" pathname={location.pathname} />
        </NavItem>
        <NavItem>
          <LinkItem
            url="/history"
            text="History"
            pathname={location.pathname}
          />
        </NavItem>
      </Nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task/:id" element={<Task />} />
        <Route path="/tag" element={<TagList />} />
        <Route path="/tag/:id" element={<TagDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
