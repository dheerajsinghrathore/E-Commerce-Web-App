const validURLConvert = (url) => {
  try {
    const validURL = new URL(url);
    return validURL.href;
  } catch (error) {
    return null;
  }
};

export default validURLConvert;
