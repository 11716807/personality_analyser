import React from "react";
const SubmitButton = ({ handleSubmit, inputText, selectedOption, selectedStrategy, loading }) => {
  return (
    <div className="text-end">
      <button
        className="bot-submit btn btn-warning btn-orange mt-2"
        onClick={() => handleSubmit(inputText, selectedOption, selectedStrategy)}
        disabled={loading}
      >
        {loading ? "Processing..." : "Assist"}
      </button>
    </div>
  );
};

export default SubmitButton;