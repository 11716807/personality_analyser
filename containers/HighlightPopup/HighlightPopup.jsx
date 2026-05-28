import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import './HighlightPopup.css';

/**
 * HighlightPopup - A popup component that appears when text is selected
 * 
 * @component
 * @example
 * // Using with Font Awesome
 * import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 * import { faPlus } from '@fortawesome/free-solid-svg-icons'
 * 
 * <HighlightPopup
 *   name="Add Message"
 *   icon={<FontAwesomeIcon icon={faPlus} />}
 *   position={{ x: 100, y: 200 }}
 *   onClick={() => console.log('clicked')}
 * />
 * 
 * // Using with SVG or Image
 * <HighlightPopup
 *   name="Custom Action"
 *   icon={<img src="icon.png" width="24" height="24" alt="icon" />}
 *   position={{ x: 100, y: 200 }}
 *   onClick={() => console.log('clicked')}
 * />
 */
const HighlightPopup = ({
  /** Position of the popup. Should contain x and y coordinates relative to the viewport */
  position,
  /** Callback function to be called when the popup is clicked */
  onClick,
  /** Text to be displayed next to the icon */
  name,
  /** 
   * Icon component to be displayed. Can be any valid React element (FontAwesomeIcon, SVG, img, etc)
   * For consistent styling, the icon component should:
   * - Have dimensions of 24x24 pixels
   * - If using FontAwesomeIcon, no additional styling needed
   * - If using SVG, set width and height to "24"
   * - If using img, set width and height to "24"
   */
  icon: IconComponent
}) => {
  console.log('[PsyGenie] [HighlightPopup] [DEBUG] Rendering HighlightPopup with:', {
    position,
    name
  });

  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    onClick();
  };

  return (
    <button
      className={`highlight-popup ${isHovered ? 'expanded' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
    >
      {loading ? (
        <FontAwesomeIcon
          icon={faCircleNotch}
          className="highlight-popup-icon"
          spin
        />
      ) : (
        <div className="highlight-popup-icon">
          {IconComponent}
        </div>
      )}
      <span className="highlight-popup-text">{name}</span>
    </button>
  );
};

HighlightPopup.propTypes = {
  /** Position object must have x and y coordinates */
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  /** onClick handler function */
  onClick: PropTypes.func.isRequired,
  /** Display name for the action */
  name: PropTypes.string.isRequired,
  /** Icon component (FontAwesomeIcon, SVG, img, etc) */
  icon: PropTypes.element.isRequired
};

export default HighlightPopup;
