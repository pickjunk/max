import { create, SheetsRegistry } from 'jss';
import { createMuiTheme } from '@material-ui/core/styles';
import { createGenerateClassName } from '@material-ui/styles';
import customTheme, { globalStyle } from '../theme';
import preset from 'jss-preset-default';

// jss default preset
const jss = create(preset());

// jss global style
jss.createStyleSheet(globalStyle).attach();

// custom theme
const theme = createMuiTheme(customTheme);

function createPageContext() {
  return {
    theme,
    jss,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

let pageContext;

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!pageContext) {
    pageContext = createPageContext();
  }

  return pageContext;
}