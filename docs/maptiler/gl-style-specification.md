---
title: "GL Style Specification | Gl style specification | MapTiler"
source: "https://docs.maptiler.com/gl-style-specification"
description: "GL style is a document that defines the visual appearance of a map | Gl style specification | GL Style Specification"
---

# GL Style Specification

A GL style is a document that defines the visual appearance of a map: what data to draw, the order to draw it in, and how to style the data when drawing it. A style document is a [JSON](https://www.json.org/) object with specific root level and nested properties. This specification defines and describes these properties.

The intended audience of this specification includes:

- Advanced designers and cartographers who want to write styles by hand.
- Developers using style-related features of [MapTiler SDK JS](https://docs.maptiler.com/sdk-js/) or the Mobile SDK for [iOS](https://docs.maptiler.com/mobile-sdk/ios/) and [Android](https://docs.maptiler.com/mobile-sdk/android/).
- Authors of software that generates or processes MapLibre styles.

## Style document structure

A GL style consists of a set of [root properties](https://docs.maptiler.com/gl-style-specification/root), some of which describe a single global property, and some of which contain nested properties. Some root properties, like [`version`](https://docs.maptiler.com/gl-style-specification/root/#version), [`name`](https://docs.maptiler.com/gl-style-specification/root/#name), and [`metadata`](https://docs.maptiler.com/gl-style-specification/root/#metadata), don’t have any influence over the appearance or behavior of your map, but provide important descriptive information related to your map. Others, like [`layers`](https://docs.maptiler.com/gl-style-specification/layers) and [`sources`](https://docs.maptiler.com/gl-style-specification/sources), are critical and determine which map features will appear on your map and what they will look like. Some properties, like [`center`](https://docs.maptiler.com/gl-style-specification/root/#center), [`zoom`](https://docs.maptiler.com/gl-style-specification/root/#zoom), [`pitch`](https://docs.maptiler.com/gl-style-specification/root/#pitch), and [`bearing`](https://docs.maptiler.com/gl-style-specification/root/#bearing), provide the map renderer with a set of defaults to be used when initially displaying the map.

##### GL Style Specification

On this page

- [Style document structure](https://docs.maptiler.com/gl-style-specification/#style-document-structure)

#### Was this helpful?

Thank you! Please tell us what's unclear or missing on this
page, so we can improve it for you.


Send


Thank you for your feedback!

You've already voted on this page.

reCAPTCHA failed! Please try again.

GL Style Specification

GL Style Specification

reCAPTCHA

Recaptcha requires verification.

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)

protected by **reCAPTCHA**

[Privacy](https://www.google.com/intl/en/policies/privacy/) \- [Terms](https://www.google.com/intl/en/policies/terms/)