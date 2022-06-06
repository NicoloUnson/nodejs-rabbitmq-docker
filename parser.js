const net = require("net");

const fs = require("fs");

const _ = require("lodash");
const throttledQueue = require('throttled-queue')

const socket = new net.Socket();

const publisher = require('./publisher');

const STX = "\u0002";
const RS = "\u001e";
const ETX = "\u0003";

let throttle = throttledQueue(20, 1000)

const parser = {
  98: {
    description: "Authentication Request Information",
    1000: "Subscriber ID",
    1001: "Password",
  },
  99: {
    description: "Authentication Response Information",
    1002: {
      description: "Sign in status",
      0: "Success",
      1: "Invalid Id or Password",
      2: "Invalid Subscription",
    },
    1005: "SessionID",
  },
  "01": {
    description: "Indices Information",
    1033: "Code",
    1036: {
      description: "Sector Code",
      1000: "BMD FKLI",
      1002: "BMD SSF Single Stock Future",
      1003: "BMD OKLI",
      1004: "BMD FCPO",
      1005: "BMD FPKO",
      1006: "BMD FKB3",
      1007: "BMD FMG3",
      1008: "BMD FMG5",
      1009: "BMD FMGA",
      1011: "BMD FTIN",
      1017: "BMD OCPO",
      1028: "BMD FGOLD",
      1035: "BMD FPOL",
    },
    1038: "Name",
    1039: "Full name",
    1040: "Share per lot",
    1044: "Trading Status",
    1050: "Previous Closing Value",
    1051: "Last Adjusted Previous Closing Value",
    1154: "Group Category",
    1055: "Open Value",
    1056: "Highest Value",
    1057: "Lowest Value",
    1098: "Current Value",
    1054: "Market Data Time",
    1053: "Market Data Date",
    1098: "Last Transacted Price",
    1099: "Last Transacted Volume",
    1100: "Last Transacted Value",
    1101: "Total Traded Volume",
    1102: "Total Traded Value",
    1103: "Transaction number",
    1131: "Exchange for this market data feed",
    1132: "Total Trade",
    1139: "The legs instrument stock code of the spread with delimiter |",
    1151: "Market Indicator",
    1157: "ISIN",
    1243: "Strike Price",
    1256: "52 week highest price",
    1257: "52 week lowest price",
  },
  "02": {
    description: "Sector Information",
    1036: "Code",
    1037: "Description",
    1131: "Exchange for this market data feed",
  },
  "05": {
    description: "Stock/Instrument Information",
    1033: "Code",
    1036: "Sector Code",
    1038: "Short name",
    1039: "Full name",
    1040: "Share per lot",
    1041: "Total Shares Issued",
    1044: "Trading Status",
    1049: "Expired Date (YYYYMMDD)",
    1050: "Previous Day Closing Price",
    1051: "Adjusted Previous Day Closing Price",
    1052: "Open Interest",
    1055: "Open Price",
    1056: "Highest Price",
    1057: "Lowest Price",
    1058: "Bid Qty 1st Level",
    1059: "Bid Qty 2nd Level",
    1060: "Bid Qty 3rd Level",
    1061: "Bid Qty 4th Level",
    1062: "Bid Qty 5th Level",
    1063: "Bid Qty 6th Level",
    1064: "Bid Qty 7th Level",
    1065: "Bid Qty 8th Level",
    1066: "Bid Qty 9th Level",
    1067: "Bid Qty 10th Level",
    1068: "Bid Price 1st Level",
    1069: "Bid Price 2nd Level",
    1070: "Bid Price 3rd Level",
    1071: "Bid Price 4th Level",
    1072: "Bid Price 5th Level",
    1073: "Bid Price 6th Level",
    1074: "Bid Price 7th Level",
    1075: "Bid Price 8th Level",
    1076: "Bid Price 9th Level",
    1077: "Bid Price 10th Level",
    1078: "Ask Qty 1st Level",
    1079: "Ask Qty 2nd Level",
    1080: "Ask Qty 3rd Level",
    1081: "Ask Qty 4th Level",
    1082: "Ask Qty 5th Level",
    1083: "Ask Qty 6th Level",
    1084: "Ask Qty 7th Level",
    1085: "Ask Qty 8th Level",
    1086: "Ask Qty 9th Level",
    1087: "Ask Qty 10th Level",
    1088: "Ask Price 1st Level",
    1089: "Ask Price 2nd Level",
    1090: "Ask Price 3rd Level",
    1091: "Ask Price 4th Level",
    1092: "Ask Price 5th Level",
    1093: "Ask Price 6th Level",
    1094: "Ask Price 7th Level",
    1095: "Ask Price 8th Level",
    1096: "Ask Price 9th Level",
    1097: "Ask Price 10th Level",
    1098: "Last Transacted Price",
    1099: "Last Transacted Volume",
    1100: "Last Transacted Value",
    1101: "Total Traded Volume",
    1102: "Total Traded Value",
    1103: "Transaction number",
    1119: {
      description: "Type",
      1: "Cash / Normal Stock",
      2: "Bond",
      5: "Preference Shares",
      6: "Rights",
      7: "Loan Stocks",
      8: "Warrants",
      9: "Exchange Traded Funds",
      10: "Funds",
      11: "Unit Trusts",
      12: "Stapled Securities",
      13: "Depository Receipts",
      15: "Index",
      16: "Call Warrants",
      17: "Put Warrants",
      18: "Extended Settlement",
      19: "Knock out Warrant Call",
      20: "Knock out Warrant Put",
      21: "Corporate Bond - Retail",
      22: "Corporate Bond - Wholesale",
      23: "Sovereign Bond",
      24: "Hybrid Capital",
    },
    1123: "Par Value",
    1124: "Price VWAP",
    1125: "1st session closing price",
    1131: "Exchange for this market data feed",
    1132: "Total Trade",
    1134: "Trade currency",
    1135: "Remark",
    1139: "The legs instrument stock code of the spread with delimiter |",
    1151: "Market Indicator",
    1152: "Settlement Price",
    1153: "Theoretical Opening/Closing Price",
    1154: "Group Category",
    1155: "Foreign Limit",
    1156: "Trading Phase",
    1157: "ISIN",
    1170: "Bid Split 1",
    1171: "Bid Split 2",
    1172: "Bid Split 3",
    1173: "Bid Split 4",
    1174: "Bid Split 5",
    1175: "Bid Split 6",
    1176: "Bid Split 7",
    1177: "Bid Split 8",
    1178: "Bid Split 9",
    1179: "Bid Split 10",
    1180: "Ask Split 1",
    1181: "Ask Split 2",
    1182: "Ask Split 3",
    1183: "Ask Split 4",
    1184: "Ask Split 5",
    1185: "Ask Split 6",
    1186: "Ask Split 7",
    1187: "Ask Split 8",
    1188: "Ask Split 9",
    1189: "Ask Split 10",
    1231: "Floor Price",
    1232: "Ceiling Price",
    1237: "Total Sell Transaction Volume",
    1238: "Total Buy Transaction Volume",
    1241: "Total number of buy transaction trades",
    1242: "Total number of sell transaction trades",
    1243: "Strike Price",
    1054: "Market Data Time",
    1053: "Market Data Date",
    1256: "52 week highest price",
    1257: "52 week lowest price",
  },
  "09": {
    description: "Feed System Information (Market Data Timestamp/Heartbeat)",
    1131: "Exchange for this market data feed",
    1054: "Market Data Time",
    1053: "Market Data Date",
  },
  50: {
    description: "News Header",
    1033: "Instrument Code",
    1129: "News ID",
    1135: "News Date Time",
    1119: {
      description: "News Category",
      20: "Special Announcement",
      21: "Member Circular",
      22: "Investor Alert Announcement",
      30: "General Announcement/Listing Circular",
      31: "Financial Summary",
      32: "Entitlement",
      33: "Changes in BoardRoom/Chief Executive Officer",
      34: "Trading of Rights",
      36: "Change in Substantial Shareholder's Interest (CI)",
      37: "Change in Director's Interest",
      38: "Notice of Person's Interest to be Substantial Shareholder",
      39: "Notice of Person Ceasing(ND)",
      40: "Bernama Summary Economic News",
      41: "Bernama General Economic News",
      42: "Change of Company Secretary",
      43: "Notice of Shares Buy Back-Form 28A(NS)",
      44: "Change of Address (CA)",
      45: "Change of Registrat (CR)",
      46: "Notice of Shares Buy Back by a Company-Form 28B",
      47: "Notice of Shares Buy Back Immediate Announcement",
      49: "Notice of Resale/Cancel of Share",
      50: "Changes in Audit Committee",
    },
    1120: "News Header",
    1233: "News Link",
    1157: "News Content Provider",
  },
};

const parseStreamData = (utf) => {
  let items = utf.replaceAll(ETX, ETX + "\n").split("\n");
  let parsedData = [];
  items.map((item) => {
    if (item) {
      const entry = item.replaceAll(STX, "").replaceAll(ETX, "").split(RS);

      let details = [];
      let protocol = entry[0];
      const protocolDescription = parser[protocol]
        ? parser[protocol].description
        : "";
      entry.slice(1).map((item) => {
        const [key, value] = item.split("=");
        const keyDescription = parser[protocol] ? parser[protocol][key] : "";
        if (!keyDescription) {
          console.log(protocol, key, value);
        }
        details.push({
          key,
          keyDescription,
          value,
        });
      });
      parsedData.push({
        protocol,
        protocolDescription,
        details,
      });
    }
  });

  parsedData.map((data) => {
    const { protocolDescription, details } = data;

    const valueDetails = {};
    details.map(({ keyDescription, value }) => {
      return valueDetails[keyDescription.description
        ? keyDescription.description
        : keyDescription] = keyDescription.description
        ? keyDescription[value]
        : value;
    });
    valueDetails['time_server'] = new Date();
    const entry = {
      [protocolDescription]: valueDetails,
    };
  throttle(function(){
    publisher.publishMessage(JSON.stringify(entry))
      // do parsing
    })
  });
};

socket.on("error", (err) => {
  console.log(err);
});

let toBeParsed = "";

socket.on("data", (data) => {
  const utf = data.toString("binary");
  toBeParsed += utf;

  if (toBeParsed.endsWith(ETX)) {
    parseStreamData(toBeParsed);
    toBeParsed = "";
  }
});

socket.connect(20000, "115.84.253.205", () => {
  socket.write(`${STX}98${RS}1000=rpinnotech${RS}1001=rp1nn0t3ch${ETX}`);
});
