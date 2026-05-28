import React, { useEffect, useState } from 'react';
import fetchSubscriptionDetails from '../../API/PaymentAPI';
import PanelContainer from '../PanelContainer/PanelContainer';
import { faCircleNotch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorModal from '../Modal/ErrorModal';
import { APP_URL } from '../../API/Config/AppConfig';
import PanelLabel from '../PanelLabel/PanelLabel';
import * as PropTypes from 'prop-types';
import { formatUnixTimeToHumanReadableLocalTime } from '../../API/DateFormater';
import './UserSettings.css';
import TokenUsage from './TokenUsage'

function getPlanPeriodDisplay(period) {
  const periodMap = {
    DAILY: 'per day',
    WEEKLY: 'per week',
    MONTHLY: 'per month',
    YEARLY: 'per year',
  };

  return periodMap[period] || ''; // Default to empty if period is invalid
}

const Detail = ({ label, value }) => {
  return (
    <>
      <div className="fs-12 fw-semibold user-select-none">{label}</div>
      <div className="fs-12">{value}</div>
      <div className="mt-2"></div>
    </>
  );
};

Detail.propTypes = { planDetails: PropTypes.any };
const UserSettings = () => {
  const [planDetails, setPlanDetails] = useState(null);
  const [planDetailsLoading, setPlanDetailsLoading] = useState(false);
  const [planDetailsError, setPlanDetailsError] = useState(null);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      setPlanDetailsLoading(true);
      try {
        setPlanDetails(null);
        setPlanDetailsError(null);
        const response = await fetchSubscriptionDetails();
        setPlanDetails(response);
      } catch (error) {
        console.log('Error fetching plan details:', error);
        setPlanDetailsError(error.message);
      } finally {
        setPlanDetailsLoading(false);
      }
    };

    fetchPlanDetails();
  }, []);

  const handleSupportClick = () => {
    // chrome.tabs.create({url : 'mailto:info@psygenie.ai'});
    window.open('mailto:info@psygenie.ai?subject=[Support] - ', '_self');
  };

  return (
    <PanelContainer>
      {/*<div className="mt-3 text-center">
        <div><img src={logoImg} width={50}/></div>
        <div className="fs-5 fw-bold">PsyGenie</div>
      </div>*/}
      <div className="m-2">
        <PanelLabel text="Your PsyGenie Account" />
      </div>
      <div className="user-settings-container p-2">
        {planDetailsLoading && (
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faCircleNotch} spin className="spinner-icon-small" />
            <p>Loading plan details</p>
          </div>
        )}
        {planDetailsError && (
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}>
            <FontAwesomeIcon icon={faTimesCircle} style={{ margin: '0px 4px', color: 'red' }} />
            <span>Failed to load details.</span>
          </div>
        )}
        {planDetails && (
          <div className="">
            <div className="fs-14 mb-2">
              Here’s a quick overview of your current plan, token usage, and support options to help you stay on track!
            </div>
            <div className="card mt-3">
              <div className="card-header fw-semibold bg-gray">Account Details</div>
              <div className="card-body">
                <Detail label={'Full Name'} value={planDetails.userFullname} />
                <Detail label={'Email'} value={planDetails.userEmail} />
                <div className="text-end mt-2">
                  <button
                    className="btn btn-sm btn-orange"
                    onClick={() => {
                      chrome.tabs.create({ url: APP_URL + "/logout" });
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-header fw-semibold bg-gray">Plan Detail</div>
              <div className="card-body">
                <Detail label={'Plan Name'} value={planDetails.planName} />
                <Detail label={'Description'} value={planDetails.planDescription} />
                <Detail
                  label={'Price'}
                  value={`$${planDetails.planAmount} ${getPlanPeriodDisplay(planDetails.planPeriod)}`}
                />
                {planDetails.trial && <Detail label={'Trial Plan'} value={'Yes'} />}
                <Detail
                  label={'Subscription Status'}
                  value={
                    <div className="d-flex align-items-center">
                      {planDetails.status === 'active' && (
                        <span className="status-circle bg-success"></span>
                      )}
                      {planDetails.status === 'cancelled' && (
                        <span className="status-circle bg-danger"></span>
                      )}
                      {planDetails.status ? planDetails.status : 'N/A'}
                    </div>
                  }
                />
                {planDetails.paymentFailing && <Detail label={'Payment Failing'} value={'Yes'} />}
                <Detail label={'Start Date'} value={formatUnixTimeToHumanReadableLocalTime(planDetails.startOn)} />
                <Detail
                  label={'Next Billing Date'}
                  value={formatUnixTimeToHumanReadableLocalTime(planDetails.cycleEnd)}
                />
                <Detail label={'Max Personas'} value={planDetails.planPersonasLimit} />
                <Detail label={'Max Tokens'} value={planDetails.planMaxTokens} />
                <div className="text-end mt-2">
                  <button
                    className="btn btn-sm btn-orange"
                    onClick={() => {
                      chrome.tabs.create({ url: APP_URL + '/dashboard' });
                    }}
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>

            <TokenUsage planDetails={planDetails} />

            <div className="card mt-3">
              <div className="card-header fw-semibold bg-gray">Support</div>
              <div className="card-body">
                <div className="fs-14">
                  If you need further assistance, feel free to reach out to us. You can email us at:{' '}
                  <code>info@psygenie.ai</code>. We're here to help!
                </div>
                <div className="text-end mt-2">
                  <button className="btn btn-sm btn-orange  " onClick={handleSupportClick}>
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ErrorModal
        isOpen={planDetailsError}
        onClose={() => setPlanDetailsError(null)}
        errorMessage={
          planDetailsError === 'Network error.' ? "We're having trouble loading your details." : planDetailsError
        }
        networkIssue={planDetailsError === 'Network error.'}
        sticky={true}
      />
    </PanelContainer>
  );
};

export default UserSettings;
