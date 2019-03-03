// check default theme object
// https://material-ui.com/customization/default-theme/
// to find the props you need to override
export default {
  // https://material-ui.com/style/color/#color-tool
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#2979ff",
    },
  },
  typography: {
    useNextVariants: true
  }
};

export const globalStyle = {
  "@global": {
    ".center": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  },
};
