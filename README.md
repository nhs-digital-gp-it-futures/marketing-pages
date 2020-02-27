

# Marketing Pages

  

Nodejs with Express app to present the marketing pages.

  

## Requirements
- Node 12

Install the long-term support (LTS) version of <a href="https://nodejs.org/en/">Node.js</a>, which includes NPM.

  

## Setting up
```
git clone https://github.com/nhs-digital-gp-it-futures/marketing-pages.git
cd marketing-pages
npm install
```
## Running the application
- Run - `npm run start`
- Unit Tests - `npm run test`
- Integration Tests - `npm run test:integration`

You should now be able to view the dashboard at [http://localhost:3002/supplier/solution/100000-001](http://localhost:3002/supplier/solution/100000-001)

## Debugging the application

 1. In Visual Studio Code, go to Preferences > Settings and search for 'node debug' and turn the 'Auto Attach' option ON.
 2. Insert breakpoint/s.
 3. In Visual Studio Code, open the integrated terminal and run `npm run debug`

## Dependencies
### Buying Catalogue API
In order for the app to function properly, make sure you have an instance of the Buying Catalogue API in dev. environment running. How to set up the [Buying Catalogue API](https://github.com/nhs-digital-gp-it-futures/BuyingCatalogueService/blob/master/README.md "Buying Catalogue API setup").
