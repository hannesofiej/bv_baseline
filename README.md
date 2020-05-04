#BV Baseline

## Ny version

1. /package.json: Find denne linje: "homepage": "https://bornsvilkar.dk/upload/skolefravaer/baseline/", og ændr url'en til den nye apps foldernavn

2. /public/index.html: Find denne linje: <base href="/upload/skolefravaer/baseline/" /> og ændr url til samme som ovenfor

3. /public/data.json:
4. Giv den nye app et unikt 'appId', for at differentiere den fra de foregående.
5. Ændr evt 'title' - vises på charts-siden i en H1
6. Ændr evt. spørgsmål/svar

7. Åbn en terminal/kommando-vindue, naviger til roden af projektet og kør 'yarn build'. Der bygges nu en build-folder
8. Kopier filerne i build-folderen over i folderen på ftp-serveren

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
