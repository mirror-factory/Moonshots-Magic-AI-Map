---
title: "API key | MapTiler"
source: "https://docs.maptiler.com/cloud/api/authentication-key"
description: "An API key is a token that you provide when making API calls to authenticate them."
---

# API key

An API key is one of the [authentication methods](https://docs.maptiler.com/cloud/api/authentication/) that enables you to use our maps and access various services [via our API](https://docs.maptiler.com/cloud/api/). In practice, an API key is a string of letters and numbers in unique combinations, so that it makes clear identification of map and service requests possible.

Example of an API request authenticated with an API key:

```plaintext
https://api.maptiler.com/maps/streets-v2/?key=YOUR_MAPTILER_API_KEY_HERE#1.0/0.00000/0.00000
```

Plain text

Copy

If you replace `YOUR_MAPTILER_API_KEY_HERE` with a valid API key and paste the URL in your browser’s address bar, you’ll see the map. If you don’t provide a key, the request won’t work because it’s not identified.

## [Get a testing key](https://docs.maptiler.com/cloud/api/authentication-key/\#get-a-testing-key)

To get your API key for testing purposes, make sure you’re logged in to your [MapTiler account](https://cloud.maptiler.com/). Then follow these steps:

1. Go to page [API keys](https://cloud.maptiler.com/account/keys/).
2. Copy the **default key** and use it to play around and test your maps. _Never use it publicly!_

The default API key has no protection, so if you use it publicly, it might get stolen and misused. The primary purpose of the default key is to make all the examples in your MapTiler account work; you can use it too, but make sure it's only ever for testing or other internal purposes! For public use in production, please create a new, protected key.

## [Get a protected key for production](https://docs.maptiler.com/cloud/api/authentication-key/\#get-a-protected-key-for-production)

The requests authenticated with an API key are visible to the world, which means that anyone can see and potentially steal your API key. The thief cannot change or break your maps, because the API calls are read-only, but their usage counts towards your API request quota and can lead to extra costs (if you’re on a paid plan) or suspending your maps.

To protect your API key from misuse, create a new key for each of your applications with a set origin (specific web domain or software allowed to use the key). Using a separate key per application makes it easy to replace the key if it does get compromised. You can even create a separate API key for each of your maps to better track its traffic in your [analytics](https://cloud.maptiler.com/account/analytics).

To see how many API keys you can create, go to [Account > Settings](https://cloud.maptiler.com/account/settings) \> section **Usage** \> **Keys**. Your default key doesn't count towards the limit. If you need more keys, please [contact our Sales](https://www.maptiler.com/contacts/).

To create a new key, protected from misuse, follow these steps:

1. Go to page [API keys](https://cloud.maptiler.com/account/keys/).
2. Click on **New key**.
3. Enter a short descriptive name for the key.
4. Select one of the available methods to protect your key:


   - **Allowed HTTP origins** – restricts the API calls made with the key to specific web domains. If somebody steals your key and uses it on a different domain, it won’t work. Choose this option if you want to show a MapTiler map on your website which has a unique domain name.

   - **Allowed user-agent header** – restricts the API calls made with the key to a specific desktop or mobile application. This option is handy if you want to use a MapTiler map in your own custom application which you’ve built and in which you can set the `User-Agent` HTTP header.


👉 [Learn more about the protection methods](https://docs.maptiler.com/guides/maps-apis/maps-platform/how-to-protect-your-map-key)

5. Click **Create**. Your new key appears on the API keys page, where you can copy it anytime.

On this page

- [Get a testing key](https://docs.maptiler.com/cloud/api/authentication-key/#get-a-testing-key)
- [Get a protected key for production](https://docs.maptiler.com/cloud/api/authentication-key/#get-a-protected-key-for-production)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

API key


API key

API key

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)