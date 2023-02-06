import React from "react";
import "./style.css";

export const Modal = ({ show, content }) => {
  return (
    <div
      style={{
        transform: show ? "translateY(0vh)" : "translateY(-100vh)",
        opacity: show ? "1" : "0",
      }}
      className="modal-wrapper"
    >
      {content}
    </div>
  );
};
