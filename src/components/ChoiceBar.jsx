// Display the current dialogue choices.
import { useState } from 'react';
import TelegramIcon from '@mui/icons-material/Telegram';

export default function ChoiceBar({
  choices,
  onChoose,
  visible = true
}) {
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = () => {
    if (!selectedChoiceId) {
      return;
    }

    const selectedChoice = choices.find((choice) => choice.id === selectedChoiceId);

    if (!selectedChoice) {
      return;
    }

    const submittedText = replyText.trim() || selectedChoice.text;
    onChoose(selectedChoice, submittedText);
    setSelectedChoiceId(null);
    setReplyText('');
  };

  const handleChoiceSelect = (choice) => {
    setSelectedChoiceId(choice.id);
    setReplyText(choice.text);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="toggle-panel-content">
      <div className="reply-input-row">
        <input
          type="text"
          className="reply-input"
          placeholder=""
          value={replyText}
          disabled={!selectedChoiceId}
          onChange={(event) => setReplyText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSubmit();
            }
          }}
        />

        <button
          type="button"
          className="reply-submit-button"
          aria-label="Send reply"
          onClick={handleSubmit}
          disabled={!selectedChoiceId}
        >
          <TelegramIcon />
        </button>
      </div>

      <div className="reply-options">
        {choices.map((choice) => (
          <button
            key={choice.id}
            className={`reply-option-button${selectedChoiceId === choice.id ? ' selected' : ''}`}
            onClick={() => handleChoiceSelect(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}