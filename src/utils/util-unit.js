const autoMobileHyphen = (value) => {
  if (!value) return "";
  value = value.replace(/[^0-9]/g, "");
  let result = [];
  let restNumber = "";
  if (value.startsWith("010")) {
    result.push(value.substr(0, 3));
    restNumber = value.substring(3);
    if (restNumber.length === 8) {
      result.push(restNumber.substring(0, 4));
      result.push(restNumber.substring(4));
    }
  }
  return result.filter((val) => val).join("-");
}

const replaceBirthHyphen = (value) => {
  if (!value) return;
  return value.replaceAll("-", ".");
}

export { autoMobileHyphen, replaceBirthHyphen }
  