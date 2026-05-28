import React, { useState, useEffect } from 'react';
import { fetchWeather, fetchHolidays, fetchSubRedditTrending } from '../../../API/persona/icebreaker/IcebreakerAPI';
import {
  getCurrentLocation,
  getCountry,
  getRelevantSubreddits,
  getQuickFacts
} from '../../../API/persona/PersonaAPI';
import "../Insight.css";
import ErrorModal from "../../Modal/ErrorModal";
import AccordionItem from '../AccordionItem';
import { formatDate } from '../../../API/DateFormater';
import { SiAdguard } from "react-icons/si";



/**
 * Get the local time in a specific timezone.
 * @param {string} tz_id - The timezone ID (e.g., "Asia/Kolkata").
 * @returns {string} - The formatted local time in the specified timezone.
 */
const getLocalTimeFromTimezone = (tz_id) => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz_id,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Use 24-hour format
    });

    return formatter.format(now);
  } catch (err) {
    console.error(`Error in getLocalTimeFromTimezone: ${err.message}`);
    return 'Invalid timezone';
  }
};

const IcebreakerTab = ({ persona , isLoggedInUser}) => {
  const [weather, setWeather] = useState(null);
  const [quickFacts, setQuickFacts] = useState(null);
  const [redditData, setRedditData] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [redditLoading, setRedditLoading] = useState(false);
  const [redditError, setRedditError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [country, setCountry] = useState('');
  const [subreddits, setSubreddits] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [holidaysLoading, setHolidaysLoading] = useState(true);
  const [holidaysError, setHolidaysError] = useState(null);

  const getRedditTrending = async (subreddit) => {
    setRedditError(null);
    setRedditData([]);
    document.querySelectorAll('button.topic-btn').forEach((el) => el.classList.remove('active'));
    document.getElementById(subreddit).classList.add("active");
    try {
      setRedditLoading(true);
      const response = await fetchSubRedditTrending(subreddit);
      if (!response) {
        throw new Error(`Failed to fetch data from r/${subreddit}`);
      }
      setRedditData(response);
      setRedditLoading(false);
    } catch (err) {
      setRedditError(err.message);
      setRedditLoading(false);
    }
  };

  const toggleDescription = (index) => {
    const elements = document.querySelectorAll(".holiday_description");

    elements.forEach(element => {
      if (!element.classList.contains("hide")) {
        element.classList.add("hide");
      }

      console.log("element.id " + element.id + " index " + index);
      if (element.id == index) {
        element.classList.remove("hide");
      }
    });


  }

  useEffect(() => {
    const fetchLocationAndData = async () => {
      try {
        setWeatherLoading(true);
        setHolidaysLoading(true);

        const [city, countryData, subredditsData,quickFactsData] = await Promise.all([
          getCurrentLocation(persona.username),
          getCountry(persona.username),
          getRelevantSubreddits(persona.username),
          getQuickFacts(persona.username),
        ]);

        setCurrentLocation(city);
        setCountry(countryData);
        setSubreddits(subredditsData);
        setQuickFacts(quickFactsData);

        // Fetch both weather and holidays
        const [weatherData, holidaysData] = await Promise.all([
          fetchWeather(city),
          fetchHolidays(countryData)
        ]);

        setWeather(weatherData);
        setHolidays(holidaysData);

        setWeatherLoading(false);
        setHolidaysLoading(false);
      } catch (err) {
        setWeatherError(err.message);
        setHolidaysError(err.message);
        setWeatherLoading(false);
        setHolidaysLoading(false);
      }
    };

    fetchLocationAndData();
  }, [persona.username]);



  return (
    <div className="icebreaker-tab">
      {/* Weather Section */}
      <div className={`weather-card ${weather && weather.current.is_day ? 'weather-day': 'weather-night'} p-2 mb-1`}>
        {/*<div className="weather-city fs-12 fw-semibold">{currentLocation}</div>*/}
        <div className="weather-temp">
          {weather && (
            <div>
              {weatherLoading && !weather.length && <span className="fs-12">Loading weather data...</span>}
              {weatherError && !weather.length &&
                <span className="fs-12" style={{color: 'red'}}>Error: {weatherError}</span>}
              <div className="fs-12 fw-semibold">
                <div>{weather.location.name}, {weather.location.region}, {weather.location.country}</div>
              </div>
              <div className="weather-temp-details">
                <div className="m-2" style={{color: "#ffede6"}}>
                  <span className="fs-1 fw-bolder">{weather.current.temp_c}°c</span>
                </div>
                <div className="text-end weather-icon">
                  <div>
                  <img
                    src={`https:${weather.current.condition.icon}`}
                    alt={weather.current.condition.text} width={50}
                  />
                  </div>
                  <div className="text-start">
                    <span className="fs-12 ">{weather.current.condition.text}</span>
                    <div className="fs-12">Feels like {weather.current.feelslike_c}°C</div>
                    <div className="fs-12">Humidity {weather.current.humidity}%</div>
                  </div>
                </div>


              </div>
              <div className="fs-12 mt-1 text-start">
                Last Updated: {weather && getLocalTimeFromTimezone(weather.location.tz_id)}
              </div>
            </div>
          )}
        </div>
      </div>

              {/* Facts Section */}
            {isLoggedInUser ? (
              <div></div>
            ) : (
              <div className="accordion mt-3" id="QuickFactsAccordion">
                <AccordionItem
                  id="QuickFacts"
                  parentId="QuickFactsAccordion"
                  title={
                    <>
                      <span className="fw-bold fs-14">
                        <i className="fa-solid fa-lightbulb"></i>&nbsp; Quick Facts
                      </span>
                    </>
                  }
                  content={
                    <>
                      {quickFacts && quickFacts.length > 0 ? (
                        <div className="guidelines-section">
                          {quickFacts.map((item, index) => (
                            <div key={index} className="guideline-item">
                              <li><SiAdguard />&nbsp;{item}</li>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="fs-14 text-muted">No quick facts available.</p>
                      )}
                    </>
                  }
                  isVisible={true}
                />
              </div>
            )}


        <div className="accordion mt-2" id="RedditAccordion">
          <AccordionItem
              id="Reddit"
              parentId="RedditAccordion"
              title={
                <>
                <span className="fw-bold fs-14">
                  <i className="fa-brands fa-reddit-alien"></i>&nbsp;
                  {isLoggedInUser ? "trending topics in your area" : "Find trending topics to chat?"}
                </span>
                </>
              }
              content={
                <>
                  <div className="reddit-tab">
                    <div className="fs-14">See what's buzzing – click on relevant subreddit to explore more!</div>
                    <div>
                      {subreddits.map((subreddit, index) => (
                          <button
                              key={index}
                              onClick={() => getRedditTrending(subreddit)}
                              className="btn btn-sm fs-10 btn-outline-orange m-1 fw-semibold topic-btn"
                              id={subreddit}
                          >
                            {subreddit}
                          </button>
                      ))}
                    </div>
                    {redditLoading && !redditData.length && <p>Loading reddit data...</p>}
                    <ErrorModal
                        isOpen={redditError}
                        onClose={() => setRedditError(null)}
                        errorMessage={redditError}
                    />
                    <ul>
                      {redditData.map((post, index) => (
                          <li key={index} className="reddit-card">
                            <a href={post.url} target="_blank" rel="noopener noreferrer"
                               className="reddit-link fs-14 text-black ">
                              {post.title}
                            </a>
                            <div className="reddit-desc fs-14">{post.desc}</div>
                          </li>
                      ))}
                    </ul>
                  </div>
                </>
              }
              isVisible={true}
          />
        </div>

        {/* Holiday Section */}
        <div className="accordion mt-3" id="HolidaysAccordion">
          <AccordionItem
              id="Holidays"
              parentId="HolidaysAccordion"
              title={
                <>
                <span className="fw-bold fs-14">
                  <i className="fa-solid fa-snowman"></i>&nbsp; Upcoming Holidays {country && `in ${country}`}
                </span>
                </>
              }
              content={
                <>
                  {holidaysLoading && <p>Loading holidays data...</p>}
                  {holidaysError && <p style={{color: 'red'}}>Error: {holidaysError}</p>}

                  {holidays && holidays.length > 0 && (
                      <div className="holiday-content-box custom-scrollbar p-1">
                        {holidays.map((holiday, index) => (
                            <div key={index} className="holiday-detail mb-2 p-0">
                              <div className="holiday-header">
                                <div className="holiday-date-type">
                              <span
                                  className="fs-12 text-start text-muted text-primary fw-semibold">{formatDate(holiday.date)}</span>
                                </div>
                                <div className="fs-12 text-end fw-semibold">
                          <span className="text-orange icon-link-hover" style={{cursor: 'pointer'}}
                                onClick={() => toggleDescription(index)}>{holiday.name}</span>
                                  <div className="fs-8 text-muted">({holiday.type})</div>
                                </div>
                                {/**/}
                              </div>
                              {holiday.description && (
                                  <div id={index} className="fs-12 p-2 text-muted holiday_description hide">
                                    {holiday.description}
                                  </div>
                              )}
                            </div>
                        ))}
                      </div>
                  )}
                  {holidays && holidays.length === 0 && !holidaysLoading && (
                      <p>No holidays found for this country.</p>
                  )}
                </>
              }
              isVisible={true}
          />
        </div>
         {/* Facts Section */}
       {/* Reddit Section */}
            </div>
  );
};

export default IcebreakerTab;