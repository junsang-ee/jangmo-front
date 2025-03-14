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

const toKoreanRole = (value) => {
  switch(value) {
    case "ADMIN": return "관리자";
    case "MEMBER": return "회원";
    case "MERCENARY": return "용병";
    case "DIRECTOR": return "회원(감독)";
    case "MANAGER": return "회원(매니져)";
    default: return;
  }
}

export { autoMobileHyphen, replaceBirthHyphen, toKoreanRole }
  