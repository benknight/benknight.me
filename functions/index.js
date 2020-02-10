const { deploy } = require('./deploy');
const { getLocations, postLocation } = require('./location');
const { prettyLights } = require('./lights');

module.exports = {
  deploy,
  getLocations,
  postLocation,
  prettyLights,
};
