import '../utils/bootstrap';
// --- Post bootstrap -----
import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
  background: {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    composes: ["center"]
  },
  card: {
    [theme.breakpoints.up("xs")]: {
      width: "100%",
      height: "100%"
    },
    [theme.breakpoints.up(450)]: {
      width: 300,
      height: "unset"
    }
  },
  content: {
    display: "flex",
    flexDirection: "column"
  },
  action: {
    "& button": {
      width: "100%",
      height: "100%"
    }
  }
}));

function onClick() {
  console.log('login');
}

export default function Gate() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [passwd, setPasswd] = useState("");
  const [showPasswd, setShowPasswd] = useState(false);

  return (
    <div className={classes.background}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <TextField
            variant="outlined"
            label="用户名"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <TextField
            variant="outlined"
            label="密码"
            type={showPasswd ? "text" : "password"}
            value={passwd}
            onChange={e => setPasswd(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPasswd(!showPasswd)}>
                    {showPasswd ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </CardContent>
        <CardActions className={classes.action}>
          <Button variant="contained" color="primary" onClick={onClick}>
            登录
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
