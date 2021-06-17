export function getCardType(cc) {
  let visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
  let mastercard = new RegExp("^5[1-5][0-9]{14}$");
  let mastercard2 = new RegExp("^2[2-7][0-9]{14}$");
  let dankort = new RegExp("5019(?:[- ]?[0-9]{4}){3}");

  if (visa.test(cc)) {
    return "visa";
  }

  if (mastercard.test(cc) || mastercard2.test(cc)) {
    return "mastercard";
  }

  if (dankort.test(cc)) {
    return "dankort";
  }

  return undefined;
}
