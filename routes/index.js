var paypal = require("paypal-rest-sdk");

exports.index = function(req, res){
  var payment = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "http://127.0.0.1:3000/execute",
      "cancel_url": "http://127.0.0.1:3000/cancel"
    },
    "transactions": [{
      "amount": {
        "total": "500.00",
        "currency": "USD"
      },
      "description": "One Axe!"
    }]
  }

  paypal.payment.create(payment, function(error, payment){
    if (error) {
      console.log(error);
    } else {
      req.session.paymentId = payment.id;

      for (var i = payment.links.length - 1; i >= 0; i--) {
        var link = payment.links[i];
        if (link.method === "REDIRECT") {
          res.redirect(link.href);
        }
      }
    }
  });
};

exports.cancel = function(req, res){
  res.send("Better luck next year!");
};

exports.execute = function(req, res){
  var paymentId = req.session.paymentId;
  var payerId = req.param("PayerID");
  var details = { "payer_id": payerId };

  paypal.payment.execute(paymentId, details, function(error, payment){
    if (error) {
      console.log(error);
    } else {
      res.send("The axe is yours!");
    }
  });
};

/*
 * SDK Configuration
 */

exports.config = function() {
  paypal.configure({
    "host" : "api.sandbox.paypal.com",
    "client_id" : "AeFNdxB00jLbHBtbQMAQHVCGL9IvAN2sjD9HdFNmHeJMyJTVbkfXQuvQxki3",
    "client_secret" : "ECLktxDiOZZCtbDnZAWbkm8t_JlHEXcUpZ4TkL-4J2ttUSLRVIk65AtMFYrm"
  });
}