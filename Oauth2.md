# Burgerauth as an oauth2 provider

## Endpoints

GET - /.well-known/openid-configuration - OpenID Connect Discovery

GET - /login - Authorization Endpoint

POST - /login/oauth/access_token - Token Exchange Endpoint

POST - /userinfo - OpenID Connect UserInfo

## Supported OAuth2 Grants

Burgerauth supports the authorization code grant standard with support for:

- Proof Key for Code Exchange (PKCE)
- OpenID Connect (OCID)

To use the Authorization Code Grant as a third party application it is required to register a new application in the dashboard (/dashboard)

## Scopes

Burgerauth does not currently support scopes, and by default grants all scopes regarding user infomation

## Client types

Burgerauth supports both confidential and public client types, as defined by RFC 6749.

You can view this spec here: https://datatracker.ietf.org/doc/html/rfc6749#section-2.1

## Examples

### Confidential client

This example does not use PKCE.

1. Redirect the user to the authorization endpoint in order to get their consent for accessing the resources:

```
/login?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&response_type=code&state=STATE
```

The CLIENT_ID can be obtained by registering an application in the dashboard. The STATE is a random string that will be sent back to your application after the user authorizes. The state parameter is optional, but should be used to prevent CSRF attacks.

The user will now be asked to authorize your application. If they authorize it, the user will be redirected to the REDIRECT_URL, for example:

```
https://[REDIRECT_URI]?code=RETURNED_CODE&state=STATE
```

2. Using the provided code from the redirect, you can request a new application and refresh token. The access token endpoint accepts POST requests with application/json and application/x-www-form-urlencoded body, for example:

POST - /api/tokenauth

```
{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "code": "RETURNED_CODE",
  "grant_type": "authorization_code",
  "redirect_uri": "REDIRECT_URI" (optional, since redirect_uri is not verified on the server)
}
```
Response:
```
{
  "access_token": "(random string)",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "(random string)",
  "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmhlY3RhYml0Lm9yZyIsIm5hbWUiOiJleGFtcGxlIiwiYXVkIjoibXlhcHBpZCIsImV4cCI6MCwiaWF0IjozNjAwLCJhdXRoX3RpbWUiOjAsIm5vbmNlIjoiMDYyMGM2NGNjZmE5MzQ0NTczMTQ5NTM5MmNiMzQzYjM2MGJkMjAwYmIzM2QyNTRjNzQ3YWZjYmY1YzlhNDkzYjM3MWE0MWI2Zjk3YzM5ZWI0ZjU0YmJmNDBjYjNkNjhmNTBmNmFhNjMwMmY2ZjRkM2I0NTI4MWVjYzI2ZTQ5MjNiNDFjYTFhYTIzNjIwOTMzNmU4MGZkZjk1ZGUxMGRiMzNhZWJjY2M3MmM2NjU2ZjI4MmUzZTY0ZTFkZDVlMzkxOGJlMmM2MDA4ZmFlZGZiNGVjOGE3NDk5Y2JkMzI1NGNjM2Q0ZGI0ZTMyNjQ4NDgxZDY2Mjg0YmNkMjgyZDVkNGQ3NDg2NjU2NWZjNjhlYTM0ZTIxYmE3MTgzZDU1NWM2ZjNiOTc3ODk2Zjk4NjE5MTEwMjlkYWVmZTA2MWIyMzY3ODE1MWY3Mjk3Y2E2N2M0OWQ1MjIyYjBhZWYxNDYzZTE5ZDU2MGFlYWQyMzZkOTc4YTUwNDRlNTE4NjQwYjExZTA2Zjk1OTNiOTIyNjc4Njk5YWU4MWE3MTM3ODhjYjk0MjdkZDI4ZjA4ZGRjMGIzNmE1Mjk4MDQwMmU5MmU3ZWI0MjllMWZmN2U5NTU3NmJlNmJkNmE4NzJhMDZkYjkzNmNjNGE1MTQ3ZWY1NDRhNmJiNTljMjQ3Mjc2OTcwNTRmMzEzNTc2MmRiNDg5NmZlNjcwNDEwZTA5MjMyMDdmOWNjZmNiZmE3ZWU2NThkNDI3MjI2YWZkZjJlN2RlNzMyYTEyYTg1NGQ4OTg5MWE5OTJmNDE0MWY5Nzg4ZTE2OGQ2YWFkMjc1OGExYjM3NjZkZTVlNmJkZjMyODdlZmQ3MWU4ZTkwMjY3NjMzYmM4YTA3Y2I0ZTYxODRiZDE0MWY1ZmE1MDU0YTE0NWMyZTMxMWQ1ZDNiYWY2MjkwZDIwNTljMDQyN2U2MjAxYWIzYjM5Zjc3ZTA1ZTU0NzVkM2FhYjg5NjcxMjQ2MmZlYTBjNmRjMzJlNDcwZjIxZDliOGZhZmMxMWEzYTUzNGM5NzkzY2ZhZjE2NWI5NTAwNDBhYmE4YmI2MzJkY2I5MzhiYjBhNmNiMDhlYWQ2NmJmMDgxN2E4ODUwZTMwODFlNmQ5NTYzNzJkYzQwOTU3NmQ0ZGY5ZjY4MjM2MTZlMjI5Y2VjNTk5NjQxNjlmOTEyOTBhODUyNjk1MDg2ZGMzYjQ3OTMzOTE1M2Q0MGMzYzM2YTFiZGRjN2IyMTRlM2YzMDY3ODhiOGQwOGVjZWNkMmFlMjk2NzY5MTdlNWU3MjM5NzQyYzlkOTliYTAwZDUyMWQ5NDM2NjRiMGNiYTEyZjBhNTNhMjhjYzg4NGE5NWVhNzdjMSJ9.C_M48hKf9Ccj-lRV6X0co2vwUee5coxYEwoYfSL0ZlM"
}
```

ID Token is a jwt encoded string in this format:

```
{
   "sub": "(username)",
   "iss": "(issuer URL)",
   "name": "(username)",
   "aud": "(appid)",
   "exp": (expiration time),
   "iat": (time of issue),
   "auth_time": (time of auth),
   "nonce": "(random string)"
}
```

3. Use id_token to contact the /userinfo endpoint, with the "Authorization" HTTP header structured like this:

```
Bearer (id_token)
```

Use access_token to access other scopes, defined in scopes.md

### Public Client (PKCE)

1. PKCE (Proof Key for Code Exchange) is an extension to the OAuth flow which allows for a secure credential exchange without the requirement to provide a client secret. To achieve this, you have to provide a code_verifier for every authorization request. A code_verifier has to be a random string with a minimum length of 43 characters and a maximum length of 128 characters. It can contain alphanumeric characters as well as the characters -, ., _ and ~.

Using this code_verifier string, a new one called code_challenge is created by using one of two methods:

- If you have the required functionality on your client, set code_challenge to be a URL-safe base64-encoded string of the SHA256 hash of code_verifier. In that case, your code_challenge_method becomes S256.
- If you are unable to do so, you can provide your code_verifier as a plain string to code_challenge. Then you have to set your code_challenge_method as plain.

2. Redirect the user to the authorization endpoint in order to get their consent for accessing the resources:

```
/login?client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&response_type=code&code_challenge_method=CODE_CHALLENGE_METHOD&code_challenge=CODE_CHALLENGE&state=STATE
```

The CLIENT_ID can be obtained by registering an application in the dashboard. The STATE is a random string that will be sent back to your application after the user authorizes. The state parameter is optional, but should be used to prevent CSRF attacks.

The user will now be asked to authorize your application. If they authorize it, the user will be redirected to the REDIRECT_URL, for example:

```
https://[REDIRECT_URI]?code=RETURNED_CODE&state=STATE
```

3. Using the provided code from the redirect, you can request a new application and refresh token. The access token endpoint accepts POST requests with application/json and application/x-www-form-urlencoded body, for example:

POST - /api/tokenauth

```
{
  "client_id": "YOUR_CLIENT_ID",
  "code": "RETURNED_CODE",
  "grant_type": "authorization_code",
  "redirect_uri": "REDIRECT_URI", (optional, since redirect_uri is not verified on the server)
  "code_verifier": "CODE_VERIFIER"
}
```
Response:
```
{
  "access_token": "(random string)",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "(random string)",
  "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJleGFtcGxlIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmhlY3RhYml0Lm9yZyIsIm5hbWUiOiJleGFtcGxlIiwiYXVkIjoibXlhcHBpZCIsImV4cCI6MCwiaWF0IjozNjAwLCJhdXRoX3RpbWUiOjAsIm5vbmNlIjoiMDYyMGM2NGNjZmE5MzQ0NTczMTQ5NTM5MmNiMzQzYjM2MGJkMjAwYmIzM2QyNTRjNzQ3YWZjYmY1YzlhNDkzYjM3MWE0MWI2Zjk3YzM5ZWI0ZjU0YmJmNDBjYjNkNjhmNTBmNmFhNjMwMmY2ZjRkM2I0NTI4MWVjYzI2ZTQ5MjNiNDFjYTFhYTIzNjIwOTMzNmU4MGZkZjk1ZGUxMGRiMzNhZWJjY2M3MmM2NjU2ZjI4MmUzZTY0ZTFkZDVlMzkxOGJlMmM2MDA4ZmFlZGZiNGVjOGE3NDk5Y2JkMzI1NGNjM2Q0ZGI0ZTMyNjQ4NDgxZDY2Mjg0YmNkMjgyZDVkNGQ3NDg2NjU2NWZjNjhlYTM0ZTIxYmE3MTgzZDU1NWM2ZjNiOTc3ODk2Zjk4NjE5MTEwMjlkYWVmZTA2MWIyMzY3ODE1MWY3Mjk3Y2E2N2M0OWQ1MjIyYjBhZWYxNDYzZTE5ZDU2MGFlYWQyMzZkOTc4YTUwNDRlNTE4NjQwYjExZTA2Zjk1OTNiOTIyNjc4Njk5YWU4MWE3MTM3ODhjYjk0MjdkZDI4ZjA4ZGRjMGIzNmE1Mjk4MDQwMmU5MmU3ZWI0MjllMWZmN2U5NTU3NmJlNmJkNmE4NzJhMDZkYjkzNmNjNGE1MTQ3ZWY1NDRhNmJiNTljMjQ3Mjc2OTcwNTRmMzEzNTc2MmRiNDg5NmZlNjcwNDEwZTA5MjMyMDdmOWNjZmNiZmE3ZWU2NThkNDI3MjI2YWZkZjJlN2RlNzMyYTEyYTg1NGQ4OTg5MWE5OTJmNDE0MWY5Nzg4ZTE2OGQ2YWFkMjc1OGExYjM3NjZkZTVlNmJkZjMyODdlZmQ3MWU4ZTkwMjY3NjMzYmM4YTA3Y2I0ZTYxODRiZDE0MWY1ZmE1MDU0YTE0NWMyZTMxMWQ1ZDNiYWY2MjkwZDIwNTljMDQyN2U2MjAxYWIzYjM5Zjc3ZTA1ZTU0NzVkM2FhYjg5NjcxMjQ2MmZlYTBjNmRjMzJlNDcwZjIxZDliOGZhZmMxMWEzYTUzNGM5NzkzY2ZhZjE2NWI5NTAwNDBhYmE4YmI2MzJkY2I5MzhiYjBhNmNiMDhlYWQ2NmJmMDgxN2E4ODUwZTMwODFlNmQ5NTYzNzJkYzQwOTU3NmQ0ZGY5ZjY4MjM2MTZlMjI5Y2VjNTk5NjQxNjlmOTEyOTBhODUyNjk1MDg2ZGMzYjQ3OTMzOTE1M2Q0MGMzYzM2YTFiZGRjN2IyMTRlM2YzMDY3ODhiOGQwOGVjZWNkMmFlMjk2NzY5MTdlNWU3MjM5NzQyYzlkOTliYTAwZDUyMWQ5NDM2NjRiMGNiYTEyZjBhNTNhMjhjYzg4NGE5NWVhNzdjMSJ9.C_M48hKf9Ccj-lRV6X0co2vwUee5coxYEwoYfSL0ZlM"
}
```

3. Use id_token to contact the /userinfo endpoint, with the "Authorization" HTTP header structured like this:

```
Bearer (id_token)
```

Use access_token to access other scopes, defined in scopes.md
