// Display the current dialogue choices.

import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

export default function ChoiceBar({
  choices,
  onChoose
}) {
  return (
    <div className="toggle-panel-content">
      <div className="reply-input-row">
        <input
          type="text"
          className="reply-input"
          placeholder="Write a reply"
          // value={replyText}
          // onChange={(event) => setReplyText(event.target.value)}
          // onKeyDown={(event) => {
          //   if (event.key === 'Enter') {
          //     event.preventDefault();
          //     handleSendClick();
          //   }
          // }}
        />

        <button
          type="button"
          className="reply-submit-button"
          aria-label="Send reply"
          // onClick={handleSendClick}
        >
          <SendOutlinedIcon />
        </button>
      </div>

      <div className="reply-options">
        {choices.map(choice => (
          <button
            key={choice.id}
            className={`reply-option-button`}
            onClick={() => onChoose(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}