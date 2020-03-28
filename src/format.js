function format(num) {
  if (Math.floor(num) === Math.floor(num * 100) / 100) return num;
  if (Math.floor(num * 10) === num * 10)
    return Number.parseFloat(num).toFixed(1);
  return Math.floor(num * 100) / 100;
}

export default format;
