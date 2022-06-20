import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  if (!notification) return null;

  const notificationStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (notification.error === false) {
    return (
      <div style={{ ...notificationStyle, color: 'green' }}>
        {notification.content}
      </div>
    );
  }
  return (
    <div className="error" style={{ ...notificationStyle, color: 'red' }}>
      {notification.content}
    </div>
  );
};

export default Notification;
