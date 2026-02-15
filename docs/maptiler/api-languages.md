# Languages![MapTiler logo](https://docs.maptiler.com/favicon.ico)

![GitHubLogo](https://docs.maptiler.com/assets/img/github.svg)[src/language.ts](https://github.com/maptiler/maptiler-sdk-js/blob/main/src/language.ts)

The MapTiler SDK JS has a built-in list of compatible languages, which can be used as shorthand for the
[ISO language codes](https://en.wikipedia.org/wiki/ISO_639-1) used to define the language of the map labels.
The language generally depends on the map's style.


The MapTiler SDK JS also provides seamless support for **right-to-left languages**.
Arabic, Hebrew, and other right-to-left languages are fully supported by default. No extra plugins are needed.


Check out the [complete list of supported languages](https://github.com/maptiler/maptiler-client-js/blob/main/src/language.ts).
In addition to the built-in ISO languages, there are these special cases for supported languages:


- `Language.AUTO`: uses the default language of the browser
- `Language.LATIN`: uses the default fallback language in the Latin charset
- `Language.LOCAL`: uses the local language for each country
- `Language.NON_LATIN`: uses the default fallback language in the non-Latin charset
- `Language.STYLE`: uses the language defined by the style


Language.STYLE is the default state. Once you switch the language from `STYLE`,
you **cannot switch it back**.


- `Language.STYLE_LOCK`: keep the language from the style and prevent any further updates


Language.STYLE\_LOCK should **only** be used in the **constructor**.


- `Language.VISITOR`: uses the preferred language from the user settings and the "default name".
This mode is useful when a user needs to access both local names and English names, for example, when traveling abroad where signs are likely to be available only in the local language

- `Language.VISITOR_ENGLISH`: uses English and the "default name".
This mode is useful when a user needs to access both local names and English names, for example, when traveling abroad where signs are likely to be available only in the local language


The "default name" is equivalent to OSM's `{name}`,
which is either the most globally recognized name or the local name.


## [Related examples](https://docs.maptiler.com/sdk-js/api/languages/\#languages-related)

- [How to change the default map labels language](https://docs.maptiler.com/sdk-js/examples/language-map/)
- [How to change the map labels language based on visitor's location](https://docs.maptiler.com/sdk-js/examples/ip-map-language/)
- [Change a map's language](https://docs.maptiler.com/sdk-js/examples/language-switch/)
- [Display and style rich text labels](https://docs.maptiler.com/sdk-js/examples/display-and-style-rich-text-labels/)


Reference documentation of MapTiler SDK JS, an extension of MapLibre GL JS



##### [![MapTiler SDK JS the easiest way for developers to integrate maps with their web applications and products is using our JavaScript Maps SDK](https://docs.maptiler.com/assets/img/sdk-js-logo-icon.svg)](https://docs.maptiler.com/sdk-js/)

On this page

- [Related examples](https://docs.maptiler.com/sdk-js/api/languages/#languages-related)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

SDK JS


Reference


Languages

Languages

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)