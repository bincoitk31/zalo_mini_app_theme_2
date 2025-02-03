import { decode } from 'html-entities'

export const intCurrencyList = ['VND', 'TWD', 'LAK', 'PHP', 'MMK', 'JPY', 'INR', 'COP', 'IDR', 'CLP', 'PYG'];
export const currencyPrefixList = ['TWD', 'USD', 'JPY', 'PHP', 'IDR', 'COP'];
export const dotList = ['USD', 'TWD', 'JPY', 'PHP', 'THB', 'MYR', 'IDR', 'INR'];
export const xctCurrencyList = ['IDR', 'KRW', 'THB', 'KHR', 'BDT', 'KPW', 'MNT']; // Danh sách không hiển thị phần thập phân nếu là 00
export const getFloatChar = currency => (dotList.includes(currency) ? '.' : ',');

export const currencySymbols = new Map([
  ["AED", "&#1583;.&#1573;"], // ?
  ["AFN", "&#65;&#102;"],
  ["ALL", "&#76;&#101;&#107;"],
  ["AMD", ""],
  ["ANG", "&#402;"],
  ["AOA", "&#75;&#122;"], // ?
  ["ARS", "&#36;"],
  ["AUD", "&#36;"],
  ["AWG", "&#402;"],
  ["AZN", "&#1084;&#1072;&#1085;"],
  ["BAM", "&#75;&#77;"],
  ["BBD", "&#36;"],
  ["BDT", "&#2547;"], // ?
  ["BGN", "&#1083;&#1074;"],
  ["BHD", ".&#1583;.&#1576;"], // ?
  ["BIF", "&#70;&#66;&#117;"], // ?
  ["BMD", "&#36;"],
  ["BND", "&#36;"],
  ["BOB", "&#36;&#98;"],
  ["BRL", "&#82;&#36;"],
  ["BSD", "&#36;"],
  ["BTN", "&#78;&#117;&#46;"], // ?
  ["BWP", "&#80;"],
  ["BYR", "&#112;&#46;"],
  ["BZD", "&#66;&#90;&#36;"],
  ["CAD", "&#36;"],
  ["CDF", "&#70;&#67;"],
  ["CHF", "&#67;&#72;&#70;"],
  ["CLF", ""], // ?
  ["CLP", "&#36;"],
  ["CNY", "&#165;"],
  ["COP", "&#36;"],
  ["CRC", "&#8353;"],
  ["CUP", "&#8396;"],
  ["CVE", "&#36;"], // ?
  ["CZK", "&#75;&#269;"],
  ["DJF", "&#70;&#100;&#106;"], // ?
  ["DKK", "&#107;&#114;"],
  ["DOP", "&#82;&#68;&#36;"],
  ["DZD", "&#1583;&#1580;"], // ?
  ["EGP", "&#163;"],
  ["ETB", "&#66;&#114;"],
  ["EUR", "&#8364;"],
  ["FJD", "&#36;"],
  ["FKP", "&#163;"],
  ["GBP", "&#163;"],
  ["GEL", "&#4314;"], // ?
  ["GHS", "&#162;"],
  ["GIP", "&#163;"],
  ["GMD", "&#68;"], // ?
  ["GNF", "&#70;&#71;"], // ?
  ["GTQ", "&#81;"],
  ["GYD", "&#36;"],
  ["HKD", "&#36;"],
  ["HNL", "&#76;"],
  ["HRK", "&#107;&#110;"],
  ["HTG", "&#71;"], // ?
  ["HUF", "&#70;&#116;"],
  ["IDR", "&#82;&#112;"],
  ["ILS", "&#8362;"],
  ["INR", "&#8377;"],
  ["IQD", "&#1593;.&#1583;"], // ?
  ["IRR", "&#65020;"],
  ["ISK", "&#107;&#114;"],
  ["JEP", "&#163;"],
  ["JMD", "&#74;&#36;"],
  ["JOD", "&#74;&#68;"], // ?
  ["JPY", "&#165;"],
  ["KES", "&#75;&#83;&#104;"], // ?
  ["KGS", "&#1083;&#1074;"],
  ["KHR", "&#6107;"],
  ["KMF", "&#67;&#70;"], // ?
  ["KPW", "&#8361;"],
  ["KRW", "&#8361;"],
  ["KWD", "&#1583;.&#1603;"], // ?
  ["KYD", "&#36;"],
  ["KZT", "&#1083;&#1074;"],
  ["LAK", "&#8365;"],
  ["LBP", "&#163;"],
  ["LKR", "&#8360;"],
  ["LRD", "&#36;"],
  ["LSL", "&#76;"], // ?
  ["LTL", "&#76;&#116;"],
  ["LVL", "&#76;&#115;"],
  ["LYD", "&#1604;.&#1583;"], // ?
  ["MAD", "&#1583;.&#1605;."], //?
  ["MDL", "&#76;"],
  ["MGA", "&#65;&#114;"], // ?
  ["MKD", "&#1076;&#1077;&#1085;"],
  ["MMK", "&#75;"],
  ["MNT", "&#8366;"],
  ["MOP", "&#77;&#79;&#80;&#36;"], // ?
  ["MRO", "&#85;&#77;"], // ?
  ["MUR", "&#8360;"], // ?
  ["MVR", ".&#1923;"], // ?
  ["MWK", "&#77;&#75;"],
  ["MXN", "&#36;"],
  ["MYR", "&#82;&#77;"],
  ["MZN", "&#77;&#84;"],
  ["NAD", "&#36;"],
  ["NGN", "&#8358;"],
  ["NIO", "&#67;&#36;"],
  ["NOK", "&#107;&#114;"],
  ["NPR", "&#8360;"],
  ["NZD", "&#36;"],
  ["OMR", "&#65020;"],
  ["PAB", "&#66;&#47;&#46;"],
  ["PEN", "&#83;&#47;&#46;"],
  ["PGK", "&#75;"], // ?
  ["PHP", "&#8369;"],
  ["PKR", "&#8360;"],
  ["PLN", "&#122;&#322;"],
  ["PYG", "&#71;&#115;"],
  ["QAR", "&#65020;"],
  ["RON", "&#108;&#101;&#105;"],
  ["RSD", "&#1044;&#1080;&#1085;&#46;"],
  ["RUB", "&#8381;"],
  ["RWF", "&#1585;.&#1587;"],
  ["SAR", "&#65020;"],
  ["SBD", "&#36;"],
  ["SCR", "&#8360;"],
  ["SDG", "&#163;"], // ?
  ["SEK", "&#107;&#114;"],
  ["SGD", "&#36;"],
  ["SHP", "&#163;"],
  ["SLL", "&#76;&#101;"], // ?
  ["SOS", "&#83;"],
  ["SRD", "&#36;"],
  ["STD", "&#68;&#98;"], // ?
  ["SVC", "&#36;"],
  ["SYP", "&#163;"],
  ["SZL", "&#76;"], // ?
  ["THB", "&#3647;"],
  ["TJS", "&#84;&#74;&#83;"], // ? TJS (guess)
  ["TMT", "&#109;"],
  ["TND", "&#1583;.&#1578;"],
  ["TOP", "&#84;&#36;"],
  ["TRY", "&#8356;"], // New Turkey Lira (old symbol used)
  ["TTD", "&#36;"],
  ["TWD", "&#78;&#84;&#36;"],
  ["TZS", ""],
  ["UAH", "&#8372;"],
  ["UGX", "&#85;&#83;&#104;"],
  ["USD", "&#36;"],
  ["UYU", "&#36;&#85;"],
  ["UZS", "&#1083;&#1074;"],
  ["VEF", "&#66;&#115;"],
  ["VND", "&#8363;"],
  ["VUV", "&#86;&#84;"],
  ["WST", "&#87;&#83;&#36;"],
  ["XAF", "&#70;&#67;&#70;&#65;"],
  ["XCD", "&#36;"],
  ["XDR", ""],
  ["XOF", ""],
  ["XPF", "&#70;"],
  ["YER", "&#65020;"],
  ["ZAR", "&#82;"],
  ["ZMK", "&#90;&#75;"], // ?
  ["ZWL", "&#90;&#36;"]
]);

export const getCurrencySymbol = currency =>
  decode(currencySymbols.get(currency) || "&#8363")

export const formatNumber = (value, currency = 'VND', prefix = true, formShopee, useFormatCurrencyAdvanced = false) => {
  const floatChar = getFloatChar(currency);
  value = value ? value.toString() : '0';
  if (value.includes(floatChar) && !intCurrencyList.includes(currency) && value.indexOf(floatChar) > value.length - 3) return value;
  let minusChar = parseInt(value) < 0 ? '-' : '';
  let amount = Math.abs(parseInt(intCurrencyList.includes(currency) ? Math.round(value) : value)) || 0;

  const multipleCurrencyAdvanced = {}
  const currencyConvert = (multipleCurrencyAdvanced?.[currency]?.convert || []).sort((a, b) => Number(b.value) - Number(a.value))
  const useDot = multipleCurrencyAdvanced?.[currency]?.useDot ?? 1

  const symbol = currencyConvert.find(cc => cc.value != 0 && (Number(value) / Number(cc.value)) >= 1 )

  if(useFormatCurrencyAdvanced && symbol) {
    const symbolText = symbol.text
    const symbolValue = Number(symbol.value)

    const formatValue = (Number(value) / Number(symbolValue)).toFixed(1)

    if(formatValue % 1 == 0) return `${parseInt(formatValue)} ${symbolText}`
    return `${formatValue} ${symbolText}`
  }


  amount = amount
    ? !intCurrencyList.includes(currency) && typeof currency != 'undefined' && currency
      ? `${Math.floor(amount / 100)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${floatChar == '.' ? ',' : '.'}`)}${Math.abs(amount) % 100
          ? prefix
            ? floatChar + (Math.abs(amount) % 100 > 9 ? Math.abs(amount) % 100 : '0' + (Math.abs(amount) % 100))
            : floatChar +
            ((Math.abs(amount) % 100) % 10
              ? Math.abs(amount) % 100 > 9
                ? Math.abs(amount) % 100
                : '0' + (Math.abs(amount) % 100)
              : Math.floor((Math.abs(amount) % 100) / 10))
          : prefix && !xctCurrencyList.includes(currency) && useDot == 1
            ? `${floatChar}00`
            : ''
      }`
      : amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${floatChar == '.' ? ',' : '.'}`)
    : amount;
  if (typeof currency != 'undefined' && prefix && !formShopee)
    return currencyPrefixList.includes(currency)
      ? getCurrencySymbol(currency) + ' ' + minusChar + amount
      : minusChar + amount + ' ' + getCurrencySymbol(currency);
  else return minusChar + amount;
}