import React, { useEffect, useRef, useState } from 'react';
import useAuthStore from '../store/auth-store';
import { socket } from '../socket';

type Message = {
  from: 'me' | 'them';
  text: string;
};

const HomePage: React.FC = () => {
  const { user } = useAuthStore();

  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<any | null>(null);
  const activeChatUserRef = useRef<any | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  /** 🔹 SIDEBAR STATE */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* -------------------- API -------------------- */

  const fetchMessages = async (toUserId: string, cursor?: string | null) => {
    const url = new URL(import.meta.env.VITE_BackendURI + '/api/message/fetch-messages');
    url.searchParams.append('toUserId', toUserId);
    if (cursor) url.searchParams.append('cursor', cursor);

    const res = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
    });

    return res.json();
  };

  const fetchSidebarUsers = async () => {
    const res = await fetch(
      import.meta.env.VITE_BackendURI + '/api/utility/get-user-for-sidebar',
      { credentials: 'include' }
    );
    const data = await res.json();
    setChatUsers(data.users);
  };

  /* -------------------- SOCKET -------------------- */

  useEffect(() => {
    socket.connect();

    socket.on('message', (data) => {
      const activeUser = activeChatUserRef.current;
      if (activeUser && data.from === activeUser._id) {
        setMessages((prev) => [
          ...prev,
          { from: 'them', text: data.message },
        ]);
      }
    });

    return () => {
      socket.off('message');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    activeChatUserRef.current = activeChatUser;
  }, [activeChatUser]);

  /* -------------------- LOAD INITIAL CHAT -------------------- */

  useEffect(() => {
    const loadInitialMessages = async () => {
      if (!activeChatUser) return;

      setMessages([]);
      setCursor(null);
      setHasMore(true);

      const data = await fetchMessages(activeChatUser._id);
      if (!data?.messages) return;

      const formatted = data.messages.map((msg: any) => ({
        from: msg.from === activeChatUser._id ? 'them' : 'me',
        text: msg.content,
      }));

      setMessages(formatted);
      setCursor(data.nextCursor || null);
    };

    loadInitialMessages();
  }, [activeChatUser]);

  /* -------------------- FETCH OLDER (TOP SCROLL) -------------------- */

  const fetchOlderMessages = async () => {
    if (!activeChatUser || !cursor || isFetching || !hasMore) return;

    setIsFetching(true);

    const container = messagesContainerRef.current;
    const prevHeight = container?.scrollHeight || 0;

    const data = await fetchMessages(activeChatUser._id, cursor);

    if (data?.messages?.length) {
      const older = data.messages.map((msg: any) => ({
        from: msg.from === activeChatUser._id ? 'them' : 'me',
        text: msg.content,
      }));

      setMessages((prev) => [...older, ...prev]);
      setCursor(data.nextCursor || null);
    } else {
      setHasMore(false);
    }

    requestAnimationFrame(() => {
      if (container) {
        container.scrollTop =
          container.scrollHeight - prevHeight;
      }
    });

    setIsFetching(false);
  };

  /* -------------------- SCROLL HANDLER -------------------- */

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (container.scrollTop <= 0) {
      fetchOlderMessages();
    }
  };

  /* -------------------- AUTO SCROLL -------------------- */

  useEffect(() => {
    if (!isFetching) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /* -------------------- SEND MESSAGE -------------------- */

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeChatUser) return;

    await fetch(import.meta.env.VITE_BackendURI + '/api/message/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        toUserId: activeChatUser._id,
        message: messageInput.trim(),
      }),
    });

    setMessages((prev) => [
      ...prev,
      { from: 'me', text: messageInput.trim() },
    ]);

    setMessageInput('');
  };

  useEffect(() => {
    fetchSidebarUsers();
  }, []);

  /* -------------------- UI -------------------- */

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      
      {/* 🔹 TOP NAVBAR */}
      <header className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden text-xl"
        >
          ☰
        </button>

        <h1 className="font-semibold">Chat App</h1>

        {/* CURRENT USER */}
        <div className="flex items-center gap-2">
          <span className="text-sm">{user?.username}</span>
          <img
            src={user?.profilePhoto}
            className="w-8 h-8 rounded-full"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* 🔹 SIDEBAR */}
        <aside
          className={`fixed sm:static z-40 w-64 h-full bg-gray-900 border-r border-gray-700 p-3
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0`}
        >
          <h2 className="mb-4 font-semibold">Chats</h2>

          {chatUsers.map((u) => (
            <button
              key={u._id}
              onClick={() => {
                setActiveChatUser(u);
                setSidebarOpen(false); // close on mobile
              }}
              className={`flex items-center gap-3 w-full p-2 rounded hover:bg-gray-800
                ${activeChatUser?._id === u._id ? 'bg-gray-800' : ''}
              `}
            >
              <img src={u.profilePhoto} className="w-8 h-8 rounded-full" />
              <span>{u.username}</span>
            </button>
          ))}
        </aside>

        {/* 🔹 CHAT AREA */}
        <main className="flex-1 flex flex-col">
          
          {/* CHAT HEADER */}
          <div className="p-4 border-b border-gray-700">
            {activeChatUser ? activeChatUser.username : 'Select a chat'}
          </div>

          {/* MESSAGES */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {isFetching && (
              <p className="text-center text-xs text-gray-400">
                Loading...
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-xs px-4 py-2 rounded ${
                  msg.from === 'me'
                    ? 'bg-blue-600 ml-auto'
                    : 'bg-gray-800 mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          {activeChatUser && (
            <div className="p-4 border-t border-gray-700 flex gap-2">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-gray-800 px-3 py-2 rounded"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 px-4 rounded"
              >
                Send
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
