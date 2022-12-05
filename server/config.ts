export default {
  validator: (config) => {
    if (!config.purgingAPIToken) {
      throw new Error(
        "purgingAPIToken needs to be set to your Stellate service's purging API token."
      );
    }

    if (!config.serviceName) {
      throw new Error(
        "serviceName needs to be set to your Stellate service's name."
      );
    }
  },
};
