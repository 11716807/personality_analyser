import React, { useEffect, useState, useRef } from 'react';
import { Form, Alert, Spinner } from 'react-bootstrap';
import { axiosInstance } from '../../../API/CustomAxiosConfig'; // Ensure this is the correct axios instance
import MessageComponent from "../constants/MessageComponent";
import { APP_URL } from '../../../API/Config/AppConfig';

const KnowMore = ({ knowledge, handleNext, handlePrevious, uploadMessage , setUploadMessage}) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const questionRefs = useRef([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axiosInstance.get(`/chrome/question/${encodeURIComponent(knowledge)}`);
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error.message || error);
        setLoading(false);
      }
    };

    if (knowledge) {
      setLoading(true);
      fetchQuestions();
    }
  }, [knowledge]);

  const handleOptionChange = (question, answer) => {
    setResponses((prev) => {
      const currentResponses = prev[question] || [];
      const updatedResponses = currentResponses.includes(answer)
        ? currentResponses.filter((item) => item !== answer) // Remove if already selected
        : [...currentResponses, answer]; // Add if not selected
      return { ...prev, [question]: updatedResponses };
    });
    setErrors((prev) => ({ ...prev, [question]: undefined }));
  };

  const validateResponses = () => {
    const newErrors = {};
    let firstUnansweredIndex = -1;

    questions.forEach((item, index) => {
      if (!responses[item.question] || responses[item.question].length === 0) {
        newErrors[item.question] = 'This question is required.';
        if (firstUnansweredIndex === -1) firstUnansweredIndex = index;
      }
    });

    setErrors(newErrors);
    return firstUnansweredIndex;
  };

  const handleSubmit = (event) => {
    setLoading1(false);
    event.preventDefault();

    const firstUnansweredIndex = validateResponses();
    if (firstUnansweredIndex === -1) {
      setLoading1(true);
      console.log("setting true loader");
      handleNext(responses);
    } else {
      questionRefs.current[firstUnansweredIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

useEffect(() => {
    if (uploadMessage !== "") {
        setLoading1(false);
    }
}, [uploadMessage]);

  return (
    <div className="">
      <div>Answer a few quick questions to help us create a deeper, personalized experience for you</div>
      <Form>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          questions.map((item, index) => (
            <Form.Group
              key={index}
              ref={(el) => (questionRefs.current[index] = el)}
              className="mt-2 mb-3 question-card"
            >
              <Form.Label className="fs-14 fw-semibold question-label">
                {item.question}
              </Form.Label>
              {item.options ? (
                item.options.map((option, i) => (
                  <div key={i} className="form-check">
                    <Form.Check
                      className="fs-14"
                      type="checkbox"
                      id={`${index}-${i}`}
                      name={`question-${index}`}
                      checked={responses[item.question]?.includes(option) || false}
                      onChange={() => handleOptionChange(item.question, option)}
                    />
                    <label className="form-check-label" htmlFor={`${index}-${i}`}>
                      {option}
                    </label>
                  </div>
                ))
              ) : (
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Type your response here..."
                  onChange={(e) => setResponses((prev) => ({ ...prev, [item.question]: e.target.value }))}
                />
              )}
              {errors[item.question] && (
                <Alert variant="danger" className="mt-2 p-2 m-1">
                  {errors[item.question]}
                </Alert>
              )}
            </Form.Group>
          ))
        )}

        <div className="mt-3 mb-2">
          {uploadMessage && (
            <div className={`alert p-2 mt-2 ${uploadMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
             <MessageComponent message = {uploadMessage} flag={true} onButtonClick={() => chrome.tabs.create({ url: APP_URL + '/plans/active' })}
              />
            </div>
          )}
          <div className="d-flex mb-2">
            <button className="btn float-start btn-gray btn-sm" onClick={handlePrevious}>
              <i className="fa-solid fa-angles-left"></i> Prev
            </button>
            <button className="btn ms-auto btn-gray btn-sm" onClick={handleSubmit} disabled={loading1}>
            {loading1 ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                {' '}submitting...
              </>
            ) :  (
              <>
                Next <i className="fa-solid fa-forward"></i>
              </>
            )}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default KnowMore;
