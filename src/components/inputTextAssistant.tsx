"use client";

import React, { useState } from "react";
import { FaTimes as IconClose, FaPaperPlane as IconSendMessage } from "react-icons/fa";

type InputTextAssistantProps = {
  handleChangeAssistant: (status: boolean) => void;
  onSendMessage: (message: string) => void;
};

const InputTextAssistant: React.FC<InputTextAssistantProps> = ({
  handleChangeAssistant,
  onSendMessage,
}) => {
  const [textInput, setTextInput] = useState<string>("");

  const handleSend = () => {
    if (textInput.trim()) {
      console.log("📡 onSendMessage menerima pesan:", textInput);
      onSendMessage(textInput);
      setTextInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '18vw', gap: '0.4rem', alignItems: 'center', marginTop: '0.4rem', position: 'relative', backgroundColor: 'transparent' }}>
      <div
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', padding: '0.7rem', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => handleChangeAssistant(false)}
      >
        <svg width="24" height="24" viewBox="0 0 18 18" fill="white" xmlns="http://www.w3.org/2000/svg" className="fill-black"><g id="xmark"><path id="Vector" d="M3.70547 5.29451C3.26602 4.85505 3.26602 4.14314 3.70547 3.70369C3.92344 3.48396 4.21172 3.37498 4.5 3.37498C4.78828 3.37498 5.07586 3.48484 5.29523 3.70457L9 7.4074L12.7044 3.70544C12.9241 3.48396 13.2121 3.37498 13.5 3.37498C13.7879 3.37498 14.0755 3.48396 14.2954 3.70544C14.7349 4.1449 14.7349 4.85681 14.2954 5.29626L10.5899 9.00173L14.2954 12.7054C14.7349 13.1449 14.7349 13.8568 14.2954 14.2963C13.856 14.7357 13.144 14.7357 12.7046 14.2963L9 10.589L5.29453 14.2945C4.85508 14.734 4.14316 14.734 3.70371 14.2945C3.26426 13.8551 3.26426 13.1431 3.70371 12.7037L7.40918 8.99822L3.70547 5.29451Z"></path></g></svg>
        {/* <IconClose size={22} color="black" /> */}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, .45)', border: '1px solid transparent', borderRadius: '6px', padding: '0.3rem' }}>
        <textarea 
          placeholder="Type your question..."
          value={textInput}
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: 'black', backgroundColor: 'rgba(255, 255, 255, .5)', resize: 'none', minHeight: '35px', padding: '0.4rem 0.8rem', borderRadius: '6px'}}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div
        style={{ backgroundColor: 'rgb(42 109 162)', padding: '0.6rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
        onClick={handleSend}
      >
        {/* <IconSendMessage size={16} color="black" /> */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="fill-white"><path d="M16.0467 9.67336L10.3401 6.82003C6.50672 4.90003 4.93339 6.47336 6.85339 10.3067L7.43339 11.4667C7.60005 11.8067 7.60005 12.2 7.43339 12.54L6.85339 13.6934C4.93339 17.5267 6.50005 19.1 10.3401 17.18L16.0467 14.3267C18.6067 13.0467 18.6067 10.9534 16.0467 9.67336ZM13.8934 12.5H10.2934C10.0201 12.5 9.79339 12.2734 9.79339 12C9.79339 11.7267 10.0201 11.5 10.2934 11.5H13.8934C14.1667 11.5 14.3934 11.7267 14.3934 12C14.3934 12.2734 14.1667 12.5 13.8934 12.5Z"></path></svg>
      </div>
    </div>
  );
};

export default InputTextAssistant;
