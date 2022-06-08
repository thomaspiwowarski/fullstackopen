const Notification = ({ message }) => {
  if (!message) return null;

  const notificationStyle = {
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (message.error === false) {
    return (
      <div style={{ ...notificationStyle, color: "green" }}>
        {message.content}
      </div>
    );
  }
  return (
    <div className='error' style={{ ...notificationStyle, color: "red" }}>
      {message.content}
    </div>
  );
};

export default Notification;
