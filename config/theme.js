import { createMuiTheme } from '@material-ui/core/styles';

// check default theme object
// https://material-ui.com/customization/default-theme/
// to find the props you need to override
export default createMuiTheme({
  // https://material-ui.com/style/color/#color-tool
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: '#002140',
    },
    background: {
      default: "#eeeeee"
    },
  },
  typography: {
    useNextVariants: true
  }
});
