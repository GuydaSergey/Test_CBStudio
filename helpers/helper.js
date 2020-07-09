module.exports = {
  isExistOrEmptyString: (str) => {
    if (!str || str.length < 1) return true;
    return false;
  },
  isDate: (date) => {
    const res = new Date(date);
    if (Number.isNaN(res) || res.toString() === 'Invalid Date') return false;
    return true;
  },
};
