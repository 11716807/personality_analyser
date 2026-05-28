const customModalStyles = {
  content: {
    position: 'relative',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxHeight: '80%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
};
var countryModalBackgroundStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${require('../../assets/img/world.png')})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.1,
  zIndex: -1,
};
var totalExperienceModalBackgroundStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${require('../../assets/img/work.png')})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.1,
  zIndex: -1,
};

var currentExperienceModalBackgroundStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${require('../../assets/img/work.png')})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.1,
  zIndex: -1,
};

var locationTypeModalBackgroundStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${require('../../assets/img/work.png')})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.1,
  zIndex: -1,
};

var ethnicityModalBackgroundStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${require('../../assets/img/people.png')})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.1,
  zIndex: -1,
};
var religionModalBackgroundStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${require('../../assets/img/crowd.png')})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.1,
  zIndex: -1,
};
var collegeGradeModalBackgroundStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${require('../../assets/img/topper.png')})`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  opacity: 0.1,
  zIndex: -1,
};
export {
  customModalStyles,
  countryModalBackgroundStyle,
  totalExperienceModalBackgroundStyle,
  ethnicityModalBackgroundStyle,
  religionModalBackgroundStyle,
  collegeGradeModalBackgroundStyle,
  currentExperienceModalBackgroundStyle,
  locationTypeModalBackgroundStyle
};
