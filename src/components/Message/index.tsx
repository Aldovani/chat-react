import "./styles.scss";

type User = {
  id: string | undefined;
  name: string;
  avatar: string;
};

type MessagesType = {
  messages: {
    author: User;
    content: string;
  };
  user: string | undefined;
};

function Message({ messages, user }: MessagesType) {
  



  return (
    <div className={`container-message ${user === messages.author.id?"user-equal":""}`}>
      <div className="content-message">{messages.content}</div>
        <footer>
          <img
            src={messages.author.avatar}
            title={messages.author.name}
            alt={messages.author.name}
          />
          <span className="message-author">{messages.author.name}</span>
        </footer>
    </div>
  );
}

export { Message };
