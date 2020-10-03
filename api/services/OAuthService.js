'use strict'
// Importing the required modules
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const { ElasticBeanstalk } = require('aws-sdk');
const { error } = require('winston');
global.fetch = require('node-fetch');

const poolData = {    
  UserPoolId : "ap-south-1_GsutZBYfV", // Your user pool id here    
  ClientId : "u73kur9us1n3blimr5h34arld" // Your client id here
  };
const pool_region = 'ap-south-1';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
var cognitoUser;

exports.register=function RegisterUser(email,phone,userName,password){

  return new Promise(function (resolve, reject) {
  
  var attributeList = [];

  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:email}));
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:phone}));
  
  userPool.signUp(userName,password,attributeList, null, function(err, result){
     
    if (err) {
          reject(res.status(500).send(err.message));
          return;
      }

    cognitoUser = result.user;
      console.log('user name is ' + cognitoUser.getUsername());
       resolve("Please enter verification code sent to your email to complete the registration.");

  });
});

}

exports.reSendCode=function reSendCode(){
 
  var userData = {
    Username: 'Munisekhar.muni123@gmail.com',
    Pool: userPool
  }
  
  var cognitoUser=new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.resendConfirmationCode(function(error,data){
    if(error)
    console.log(error)
    else
    console.log(data)
  },{Username:'Munisekhar.muni123@gmail.com'})
}

exports.ConfirmRegistration=function Confirm(code,userName){
 
  return new Promise(function (resolve, reject) {

  var userData = {
    Username: userName,
    Pool: userPool
  }
  
  var cognitoUser=new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmRegistration(code,false,function(error,data){
    if(error){
    console.log(error);
    reject(res.status(500).send('Unable to confirm your registration.'));
    }
    else
    resolve('Your registration completed successfully!');
  },{Username:userName})
  });
}


exports.reSetPassword=function Confirm(code){
 
  var userData = {
    Username: 'Munisekhar.muni123@gmail.com',
    Pool: userPool,
  }
  
  var cognitoUser=new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.
  cognitoUser.changePassword(code,false,function(error,data){
    if(error)
    console.log(error)
    else
    console.log(data)
  },{Username:'Munisekhar.muni123@gmail.com'})

}

exports.login=function login(userName,password,){

  return new Promise(function (resolve, reject) {

  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: userName,
    Password: password
});

  var userData = {
    Username: userName,
    Pool: userPool
  }
  
  var cognitoUser=new AmazonCognitoIdentity.CognitoUser(userData);
 
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log(result);
       var accesstoken = result.getAccessToken().getJwtToken();
   //   accesstoken=result.getRefreshToken().getToken();
      var token=Object.assign(
        {},
        {
          token:accesstoken
        },
      )
      resolve(token);
    },
    onFailure: (function (err) {
      reject(res.status(500).send(err.message))
   }),
   mfaRequired: function (codeDeliveryDetails) {
    // console.log(codeDeliveryDetails);
    let mfaCode = prompt(`Enter MFA code`);
    cognitoUser.sendMFACode(mfaCode, this);
  }    
});
  });
}

exports.signout=function signout(userName){

  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: 'Munisekhar.muni123@gmail.com',
    Password: 'Muni@nia43'
});

  var userData = {
    Username: userName,
    Pool: userPool
  }
  
 // var cognitoUser=new AmazonCognitoIdentity.CognitoUser(userData);
  var cognitoUser=new AmazonCognitoIdentity.CognitoUser(userData);
 
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      console.log(result)
      cognitoUser.globalSignOut({
        onSuccess: function (result) {
          // var accesstoken = result.getAccessToken().getJwtToken();
          console.log("in signout ::"+result);
        },
        onFailure: (function (err) {
          console.log("in signout ::"+err);
       }),
      })
    },
    onFailure: (function (err) {
      reject(res.status(500).send(err.message))
   }),  
});

  // cognitoUser.global
  /* cognitoUser.getSession((error,data)=>{
    if(error)
    console.log(error)
    else
    console.log(data);
  }); */
 
}

exports.validateToken=function (req, res, next) {
        var token = req.headers['authorization'];
        request({
            url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
               var pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;2
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                  console.log("Not a valid JWT token");
                  res.status(401);
                  return res.send("Invalid token");
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                  console.log('Invalid token');
                  res.status(401);
                  return res.send("Invalid token");
                }

                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                      console.log("Invalid Token.");
                      res.status(401);
                      return res.send("Invalid tokern");
                    } else {
                      console.log("Valid Token.");
                      return next();
                    }
                });
            } else {
              console.log("Error! Unable to download JWKs");
              res.status(500);
              return res.send("Error! Unable to download JWKs");
            }
        });
}