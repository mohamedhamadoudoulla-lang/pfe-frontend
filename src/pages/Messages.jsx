import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../services/api";
import toast from "react-hot-toast";
import { AnimatedButton } from "@/components/animate";
import "./Messages.css";

export default function Messages() {
  const { userId }              = useParams();
  const { user }                = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent]   = useState("");
  const [loading, setLoading]   = useState(true);
  const bottomRef               = useRef(null);

  useEffect(() => {
    axios.get(`/messages/${userId}`)
      .then(res => setMessages(res.data))
      .catch(() => toast.error("Erreur chargement"))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await axios.post("/messages", { to: userId, content });
      setMessages([...messages, res.data]);
      setContent("");
    } catch { toast.error("Erreur envoi"); }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <div className="messages-avatar">💬</div>
          <div>
            <h3>Messagerie</h3>
            <p>{messages.length} message(s)</p>
          </div>
        </div>

        <div className="messages-body">
          {messages.length === 0 ? (
            <div className="messages-empty">
              <span>✉️</span>
              <p>Aucun message. Commencez la conversation !</p>
            </div>
          ) : messages.map((msg, i) => {
            const isMine = msg.from === user?._id || msg.from?._id === user?._id;
            return (
              <div key={i} className={`message-bubble ${isMine ? "mine" : "theirs"}`}>
                <p>{msg.content}</p>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString("fr-TN", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form className="messages-input" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Écrire un message..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <AnimatedButton type="submit" variant="primary" disabled={!content.trim()}>
            ➤
          </AnimatedButton>
        </form>
      </div>
    </div>
  );
}