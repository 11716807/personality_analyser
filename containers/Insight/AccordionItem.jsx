import React from 'react';

const AccordionItem = ({ id, title, content, isVisible, parentId }) => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`heading${id}`}>
        <button
          className={isVisible ? 'accordion-button' : 'accordion-button collapsed'}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse${id}`}
          aria-expanded={isVisible ? 'true' : 'false'}
          aria-controls={`collapse${id}`}
        >
          {title}
        </button>
      </h2>
      <div
        id={`collapse${id}`}
        className={`accordion-collapse collapse ${isVisible ? 'show' : ''}`}
        aria-labelledby={`heading${id}`}
        data-bs-parent={parentId ? `#${parentId}` : undefined} // Dynamically assign parentId
      >
        <div className="accordion-body">{content}</div>
      </div>
    </div>
  );
};

export default AccordionItem;