import React from "react";

//whenever we click on resume image one modal is opened , pass props of iamgeUrl and onClose 
//&times, will create a closing (X) icon
const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="resume-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <img src={imageUrl} alt="resume" />
      </div>
    </div>
  );
};

export default ResumeModal;