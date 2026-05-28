import React, { useEffect } from 'react';
import AccordionItem from '../AccordionItem';
import { OverviewSection } from '../Behaviour';

const NotesTab = ({ summary, feedback, setFeedback, handleFeedbackSubmit, handleSummaryUpdate, setSummary, submitError, persona , isLoggedInUser}) => {
  return <OverviewSection
              summary={summary}
              feedback={feedback}
              setFeedback={setFeedback}
              handleFeedbackSubmit={handleFeedbackSubmit}
              handleSummaryUpdate={handleSummaryUpdate}
              setSummary={setSummary}
              submitError={submitError}
              persona={persona}
              isLoggedInUser={isLoggedInUser}
            />;
};

export default NotesTab;
