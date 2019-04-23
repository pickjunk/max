import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import router from '@pickjunk/min/Router';
import MinScript from '@pickjunk/min/Script';
import { create, SheetsRegistry } from 'jss';
import { CssBaseline } from '@material-ui/core';
import {
  createGenerateClassName,
  StylesProvider,
  ThemeProvider,
} from '@material-ui/styles';
import theme from './config/theme';
import globalStyle from './config/global';
import preset from 'jss-preset-default';
import routes from './config/routes';

let sheetsRegistry = null;

async function render(path) {
  const Router = await router(routes, path, () => {
    alert('404 should be redirect');
  });

  // jss default preset
  const jss = create(preset());
  // jss global style
  sheetsRegistry = new SheetsRegistry();
  sheetsRegistry.add(jss.createStyleSheet(globalStyle).attach());

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        {/* Use minimum-scale=1 to enable GPU rasterization */}
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        {/* PWA primary color */}
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <style id="jss-server-side" suppressHydrationWarning={true}>
          __jss-server-side__
        </style>
        <title>Max</title>
      </head>
      <body>
        <div id="app">
          <StylesProvider
            jss={jss}
            generateClassName={createGenerateClassName()}
            sheetsRegistry={sheetsRegistry}
            sheetsManager={new Map()}
          >
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Router />
            </ThemeProvider>
          </StylesProvider>
        </div>

        <MinScript />
      </body>
    </html>
  );
}

/* Server render */
export default async function(req, res) {
  try {
    const page = await render(req.originalUrl);
    let pageString = ReactDOMServer.renderToString(page);
    pageString = pageString.replace(
      '__jss-server-side__',
      sheetsRegistry.toString(),
    );
    return pageString;
  } catch (e) {
    if (/initial location/.test(e.message)) {
      res.status(404).end('Not Found');
      return;
    }

    console.log(e);
    res.status(500).end('Internal Server Error');
  }
}

/* Client render */
if (typeof document !== 'undefined') {
  render().then(function(page) {
    ReactDOM.hydrate(page, document, () => {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    });
  });
}
