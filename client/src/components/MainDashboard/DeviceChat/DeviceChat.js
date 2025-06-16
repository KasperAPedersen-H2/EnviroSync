import React, { useState, useEffect, useRef } from "react";
import "./DeviceChat.css";

import { useSession } from "../../../context/SessionProvider";
import { useAvatar } from "../../../context/AvatarContext";

const DeviceChat = ({ deviceId }) => {
    const { globalAvatar } = useAvatar();
    const [messages, setMessages] = useState([]);
    const [newMessageText, setNewMessageText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { session } = useSession();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!deviceId) return;
            
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/message/${deviceId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                } else {
                    console.error("Failed to fetch messages");
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [deviceId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e?.preventDefault();
        
        if (!newMessageText.trim() || !deviceId) return;
        
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/message/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    device_id: deviceId,
                    message: newMessageText,
                }),
            });

            if (response.ok) {
                const newMessage = await response.json();
                setMessages((prevMessages) => [...prevMessages, {
                    ...newMessage,
                    avatar: globalAvatar,
                    username: session?.username || "You"
                }]);
                setNewMessageText("");
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!deviceId) {
        return (
            <div className="chat-container">
                <div className="no-device-selected-chat">
                    <p>Select a device to view and send messages</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.length === 0 && !isLoading ? (
                    <div className="chat-message">
                        <p className="content">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="chat-message">
                            <div className="message-header">
                                <img
                                    src={message.avatar
                                        ? `data:image/png;base64,${message.avatar}`
                                        : 'img_avatar3.png'
                                    }
                                    alt={`${message.username}'s avatar`}
                                    className="chat-avatar"
                                    onError={(e) => { e.target.src = 'img_avatar3.png'; }}
                                />
                                <p className="name">{message.username}</p>
                            </div>
                            <p className="content">{message.message}</p>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-input" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={newMessageText}
                    placeholder="Enter your message..."
                    onChange={(e) => setNewMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    );
};

export default DeviceChat;