import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const users = useSelector((state) => state.users);

  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users.map((user) => {
          return (
            <Link key={user.id} to={`/users/${user.id}`}>
              <li>
                {user.name} added {user.blogs.length}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default UsersList;
