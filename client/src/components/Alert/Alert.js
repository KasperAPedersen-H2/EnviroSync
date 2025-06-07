import React from "react";
import "./Alert.css";

const Alert = ({alerts = [], onClose}) => (
    <section className="alert-container">
        {alerts.map((alert) => (
            <article
                key={alert.id}
                className={`alert ${alert.type}`}
            >
                {alert.message}
            </article>
        ))}
    </section>
);

export default Alert;