<a id="readme-top" name="readme-top"></a>


<p align="center">
    <img src="./assets/images/carleton-u-logo.jpg" height="250">
</p>

<p align="center">
    <a href="https://bootcamp.carleton.ca/">
        <img alt="Carleton University" src="https://img.shields.io/static/v1.svg?label=bootcamp&message=Carleton&color=blue" /></a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions" >
        <img alt="JavaScript - Functions" src="https://img.shields.io/static/v1.svg?label=JavaScripts&message=functions&color=red" /></a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" >
        <img alt="JavaScript - Functions" src="https://img.shields.io/static/v1.svg?label=JavaScripts&message=arrays&color=yellow" /></a>
    <a href="https://docs.github.com/en/actions/deployment/about-deployments/about-continuous-deployment" >
        <img alt="JavaScript - Prompts" src="https://img.shields.io/static/v1.svg?label=deployment&message=production&color=green" /></a>
    <a href="https://www.linkedin.com/in/gustavo-miller-42188481/">
        <img alt="LinkedIn Platforms" src="https://img.shields.io/static/v1.svg?label=linkedIn&message=linkedin&color=blue" />
    </a>
</p>
<br/>

# Carleton University - Bootcamp

## Challenge 6: Weather Dashboard

[![Weather Dashboard][product-screenshot]](https://example.com)

<!-- ABOUT THE PROJECT -->
## About The Project

The Weather Dashboard was developed using JavaScript, JQuery and API. There are two APIs used in this application:
* api.openweathermap - this API provides hyperlocal forecast, historical data, current state, and from short-term to annual and forecasted weather data. Read more about [Opem Weather Map](https://openweathermap.org/)
* dev.virtualearth.net - The Bing Maps APIs include map controls and services that you can use to incorporate Bing Maps in applications and websites. Read more about [Bing Maps](https://www.microsoft.com/en-us/maps/bing-maps/choose-your-bing-maps-api)

Using these two API as well as JQuery we have build this page. This page uses LocalStorage to persist information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

The **Weather Dashboard** has been built using plain *HTML* and several API and technologies. *Bootstrap* collaborates with it's large number of classes and pre-define elements such as cards and navbars. The application extensively makes use of JQuery, some of the sections -such as the weather forecast section, are built dynamically using a JQuery method called **clone**, but others are built using regular methods to build element and insert them to the DOM. All icons are implemented using *Font Awesome* with its large collections of icons.

Here are a few examples.

* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![JQuery][JQuery.com]][JQuery-url]
* [![Javascript]][Javascript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## How it works

The concept is simple. When application is loaded for the first time, the application will add some cities by default such as Toronto, Montreal, Vancouver and other (with no preference).

User will enter a city (any city in Canada or anywhere else in the world) and the API will retrieve the current weather and a 5 days forecast.

Information is then saved in the computer Local Storage and keep a list. The application has a limitation of showing only 8 cities stored in the archive. Perhaps in future version user will be able to scan all cites visited.

### API Key

_This tool requires that we register and obtain our own API keys. For this example I am sharing my API key from my own account but it will expire soon_

1. Get a free API Key at [Open Weather](https://openweathermap.org/) and [Bing Maps](https://www.microsoft.com/en-us/maps/bing-maps/choose-your-bing-maps-api)
2. Enter your API in `script.js`
   ```js
   const openWeatherAPI = 'ENTER YOUR API';
   conts bingApi = 'ENTER YOUR API'
   ```
<!-- ROADMAP -->
## Roadmap

- [x] Initialize Weather environment (git init)
- [x] Add issues to address (Dev001, 002 and 003)
- [x] Create branches for the implementations; feature-InitJS, feature-History and feature-Readme
- [x] Test and Debug application

See the [open issues](https://github.com/othneildrew/Best-README-Template/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT Section -->
## Contact

In case you have any questions or would like me to help you in your IT needs, you may contact me at - gustavo.miller@miller-hs.com

Project Link: [https://gusmiller.github.io/work_day_scheduler/](https://gusmiller.github.io/work_day_scheduler/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: ./assets/images/weather001.png
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com

[Javascript]:https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[Javascript-url]:https://developer.mozilla.org/en-US/docs/Web/javascript
