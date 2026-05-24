const { withGradleProperties } = require("@expo/config-plugins");

function upsertProperty(props, key, value) {
  const existing = props.findIndex((item) => item.type === "property" && item.key === key);
  if (existing >= 0) {
    props[existing].value = value;
    return;
  }

  props.push({ type: "property", key, value });
}

module.exports = function withAndroidGradleProps(config) {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;

    upsertProperty(props, "android.compileSdkVersion", "34");
    upsertProperty(props, "android.targetSdkVersion", "34");
    upsertProperty(props, "android.minSdkVersion", "24");
    upsertProperty(props, "android.kotlinVersion", "1.9.24");
    upsertProperty(props, "android.disableAutomaticComponentCreation", "false");

    return config;
  });
};
