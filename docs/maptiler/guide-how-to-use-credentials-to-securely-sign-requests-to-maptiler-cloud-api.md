# How to use Credentials to securely sign requests to MapTiler API

This article describes how to sign requests to the MapTiler API with tokens. Using tokens is a much more secure way of authorizing requests to your MapTiler account. Choose this method when the standard authorization method, API keys, is not sufficiently strong enough.

## How do secure credentials work?

Each request is cryptographically signed when using the credentials, so using the same signature for a different request is impossible. This makes it impossible to steal the credentials during transmission and prevents any misuse of credentials.

Do not use this type of authorization in environments if your application's source code is visible to the potential attacker (such as client-side web applications).

## How to use credentials

In MapTiler administration, under **Account > [Credentials](https://cloud.maptiler.com/account/credentials/)**, create new credentials and copy the **token** (keep this token private – treat it the same way as a password).

When using the credentials, every request to the [MapTiler API](https://docs.maptiler.com/cloud/api/) has to contain `key` and `signature` query parameters.

### How to calculate the signature

- The token from Cloud has two parts separated with an underscore: `key_secret`
- Use “key” directly as `key` in the query
- Calculate `signature`:

  - Decode “secret” (encoded as hexadecimal) to get the binary secret value
  - Sign the whole URL (including “key”) using HMAC SHA256
  - Add `&signature=` as the last query parameter (URL-safe Base64 encoded)

If the URL contains any unsafe characters (such as spaces), make sure you encode them (e.g. space to `%20`) them before calculating the signature. The browser/client would possibly take care of the encoding, but the signature would be invalid.

#### Python code

```python
import base64, hashlib, hmac

def sign_url(input_url, token):
    key, _, encoded_secret = token.partition("_")

    # Add key to the URL to be signed
    keyed_url = input_url + "?key=" + key

    # Decode the secret into its binary format
    # We need to decode the URL-encoded private key
    decoded_secret = base64.b16decode(encoded_secret, casefold=True)

    # Create a signature using the private key and the URL-encoded
    # string using HMAC SHA256. This signature will be binary.
    signature = hmac.new(decoded_secret, keyed_url.encode(), hashlib.sha256)

    # Encode the binary signature into base64 for use within a URL
    encoded_signature = base64.urlsafe_b64encode(signature.digest())

    # Return signed URL
    return keyed_url + "&signature=" + encoded_signature.decode()
```

Python

Copy

On this page

- [How do secure credentials work?](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-use-credentials-to-securely-sign-requests-to-maptiler-cloud-api/#how-do-secure-credentials-work)
- [How to use credentials](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-use-credentials-to-securely-sign-requests-to-maptiler-cloud-api/#how-to-use-credentials)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

Maps platform guides


How to use Credentials to securely sign requests to MapTiler API

How to use Credentials to securely sign requests to MapTiler API

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)