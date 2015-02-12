var CryptoJS = require('crypto-js');

function sign(query, userGuid, apiKey) {

  var signed_query = {
    queryJson: JSON.stringify(query),
    expiresAt: null,
    userGuid: userGuid,
    orgGuid: "00000000-0000-0000-0000-000000000000"
  };

  var check = signed_query.queryJson
    + ":" + signed_query.userGuid
    + ((signed_query.orgGuid == "00000000-0000-0000-0000-000000000000") ? "" : (":" + signed_query.orgGuid))
    + ":" + signed_query.expiresAt;
  signed_query.digest = CryptoJS.HmacSHA1(check, CryptoJS.enc.Base64.parse(apiKey)).toString(CryptoJS.enc.Base64);

  return signed_query;
}

exports.sign = sign;
