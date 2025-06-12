import React, { useState, useEffect, useRef } from "react";
import "./DeviceChat.css";

import { useSession } from "../../../context/SessionProvider";
import { useAvatar } from "../../../context/AvatarContext";


const DeviceChat = ({ deviceId }) => {
    const { globalAvatar } = useAvatar();
    const [messages, setMessages] = useState([]);
    const [newMessageText, setNewMessageText] = useState("");
    const messagesEndRef = useRef(null);
    const { session } = useSession();


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        (async () => {
            try {
                if(!deviceId) return;

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
            }
        })();
    }, [deviceId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessageText.trim()) return;
        console.log(deviceId);
        try {
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
                    username: session.username
                }]);
                setNewMessageText("");
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className="chat-message">
                        <div className="message-header">
                            <img
                                src={message.avatar ?
                                    `data:image/png;base64,${message.avatar}` :
                                    'img_avatar3.png'
                                }
                                alt={`${message.username}'s avatar`}
                                className="chat-avatar"
                            />
                            <p className="name">{message.username}</p>
                        </div>

                        <p className="content">{message.message}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessageText}
                    placeholder="Enter your message..."
                    onChange={(e) => setNewMessageText(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default DeviceChat;