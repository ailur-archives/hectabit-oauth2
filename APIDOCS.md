# 🍔 Burgerauth API docs
Use the Burgerauth API to automate tasks, build your own client, and more!

Headers should be: "Content-type: application/json; charset=UTF-8" for all POSTs

## 🔑 Authentication

POST - /api/signup - provide "username" and "password".

POST - /api/login - provide "username", "password", "passwordchange" (must be "yes" or "no") and "newpass"

To prevent the server from knowing the encryption key, the password you provide in the request must be hashed with the SHA-3 with 128 iterations (the hash is hashed again 128 times).

If you wish to change the user's password, set "passwordchange" to "yes" and "newpass" to the new hash.

Password should be at least 8 characters, username must be under 20 characters and alphanumeric.

If username is taken, error code 422 will return.

Assuming everything went correctly, the server will return a secret key.

You'll need to store two things in local storage:
- The secret key you just got, used to create oauth2 apps, delete them etc.
- A SHA512 encryption key, for RSA compatible clients

##   OAuth2

POST - /api/auth - interface directly with the burgerauth system, provide "secretKey, appId, code and codemethod"

Code and Codemethod are only used for PKCE, if PKCE is not enabled set the value of both to "none"

appId is the client ID used in the OAuth2 manager

If it worked correctly, you should receive a code in plaintext

POST - /api/tokenauth - OAuth2 token exchange endpoint

PKCE:
- Provide client_id, code, code_verifier
- Code is the code that you received from /api/auth

Secretkey:
- Provide client_id, code, client_secret
- code is the code that you received from /api/auth
- client_secret is the client_secret shown once during oauth2 signup

If it worked correctly, you should receive the following in JSON:
```
access_token = {
    "access_token": (access token, currently unused),
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": (refresh token to use as a code for renewing the token after the expiration, provide as code in /api/tokenauth),
    "id_token": (jwt encoded token revealing user data)
}
```

## 🕹️ Basic stuff

GET - /api/version - get the system infomation of the running server

POST - /api/auth - interface directly with the burgerauth system, provide "secretKey, appId, code and codemethod"

POST - /api/userinfo - get user info such as username, provide "secretKey"

POST - /api/newauth - creates a new oauth2 app, provide "appId, secretKey". AppId is the client_id of the app.

POST - /api/deleteauth - deletes a oauth2 app, provide "appId, secretKey". AppId is the client_id of the app.

POST - /api/listauth - lists all oauth2 apps, provide 'secretKey". Returns in JSON, in this format: "appId": (appId of app).

## ⚙️ More stuff

POST - /api/deleteaccount - delete account, provide "secretKey"

Please display a warning before this action

POST - /api/sessions/list - show all sessions, provide "secretKey"

POST - /api/sessions/remove - remove session, provide "secretKey" and "sessionId"
