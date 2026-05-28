import React, { useState, useEffect } from 'react';
import AccordionItem from '../AccordionItem';
import { axiosInstance } from '../../../API/CustomAxiosConfig';

const InteractionAccordium = ({ parentId, item, userName }) => {
  const [subItems, setSubItems] = useState(null); // State for cached data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // No useEffect for initial data fetching

  const handleExpand = async () => {
    if (subItems) return; // Data already fetched

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/chrome/question/answer', {
        params: {
          personaUserName: userName,
          question: item,
        },
      });
      setSubItems({ user: userName, title: item, data: response.data });
    } catch (err) {
      setError('Failed to load sub-items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem
      id={`ChildAccordion-${parentId}`}
      parentId={parentId}
      title={
        <>
          <span className="fw-bold fs-12" onClick={handleExpand}>
            &nbsp;{item}
          </span>
        </>
      }
      content={
        <div className="sub-interactions-section">
          {loading && <span>Loading...</span>}
          {error && <span className="error-message">{error}</span>}
          {subItems && subItems.data ? subItems.data : (
            !loading && !error && <span>No sub-items available.</span>
          )}
        </div>
      }
      isVisible={false}
    />
  );
};

export default InteractionAccordium;