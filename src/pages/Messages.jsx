import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../services/api";
import toast from "react-hot-toast";
import { ArrowLeft, Send } from "lucide-react";
import "./Messages.css";

export default function Messages() {
  const { userId }              = useParams();
  const { user }                = useAuth();
  const navigate                = useNavigate();
  const [messages, setMessages] = useState([]);
  const [content, setContent]   = useState("");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [sending, setSending]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    if (!userId || userId === "undefined") {
      setError(true);
      setLoading(false);
      return;
    }
    axios.get(`/messages/${userId}`)
      .then(res => { setMessages(res.data || []); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || sending || !userId) return;
    setSending(true);
    try {
      const res = await axios.post("/messages", { to: userId, content: content.trim() });
      setMessages([...messages, res.data]);
      setContent("");
    } catch {
      toast.error("Erreur envoi message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <button className="msg-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
          <div className="messages-avatar">💬</div>
          <div><h3>Messagerie</h3><p>Chargement...</p></div>
        </div>
        <div className="messages-body">
          <div className="messages-empty"><span>⏳</span><p>Chargement des messages...</p></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <button className="msg-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
          <div className="messages-avatar">💬</div>
          <div><h3>Messagerie</h3><p>Erreur</p></div>
        </div>
        <div className="messages-body">
          <div className="messages-empty">
            <span>⚠️</span>
            <p>Impossible de charger les messages.</p>
            <button className="msg-retry-btn" onClick={() => { setLoading(true); setError(false); axios.get(`/messages/${userId}`).then(res => { setMessages(res.data || []); setError(false); }).catch(() => setError(true)).finally(() => setLoading(false)); }}>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-header">
          <button className="msg-back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
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
          <button type="submit" className="msg-send-btn" disabled={!content.trim() || sending}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}