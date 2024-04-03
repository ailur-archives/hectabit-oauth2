# Scopes

Burgerauth comes with predefined scopes used for syncing data across applications.

However, Burgerauth assumes all clients request all scopes in OAuth2 mode, as to keep compatibility with the base Burgerauth system.

## Endpoints

### RDIR - /aeskeyshare

This one requires more explanation. This is used for clients who wish to have a AES key unique to the account. To get this AES Key, create a redirect like this in JS:

```
window.postMessage("JSON.stringify({"access_token": "ACCESS_TOKEN", "redirect_uri": "REDIRECT_URI"})", https://auth.hectabit.org/aeskeyshare);
```
REDIRECT_URI is the correspondding URI where a Burgerauth LocalStorage acceptor is set up. Here is some JS code for a basic acceptor:

```
window.addEventListener(
  "message",
  (event) => {
    if (event.origin !== "https://auth.hectabit.org/aeskeyshare") return;
    localStorage.setItem("DONOTSHARE-aeskey", message)
  },
  false,
);
```
Please use this on client-side only, to maintain security and E2EE best practices.

### POST - /api/uniqueid
Provide "access_token"

Returns a ID unique to the user in this format:

```
{
    "uniqueid": "(random string)"
}
```
