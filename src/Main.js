import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  ThemeProvider,
  createMuiTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Grow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { deepOrange, grey } from "@mui/material/colors";
import { alpha, styled } from "@mui/system";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Bhargav Andhe
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: deepOrange[500],
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: alpha(grey[200], 0.25),
    },
    "&:hover fieldset": {
      borderColor: alpha(grey[200], 0.5),
    },
    "&.Mui-focused fieldset": {
      borderColor: deepOrange[400],
    },
  },
});

const theme = createMuiTheme({
  typography: {
    fontFamily: "Source Code Pro",
  },
  palette: {
    type: "dark",
    primary: deepOrange,
    background: {
      default: "#121212",
      paper: "#121212",
    },
    text: {
      primary: "#fff",
      secondary: grey[500],
    },
  },
});
const useStyles = (theme) => ({
  text: {
    fontFamily: "Work Sans",
  },
});

export default function Main() {
  const classes = useStyles(theme);

  async function getData(age, gender, bmi, children, isSmoker) {
    const base = "http://127.0.0.1:5000";
    const res = await axios.get(
      base + `/${age}/${gender}/${bmi}/${children}/${isSmoker}`
    );
    return res.data;
  }

  const [values, setValues] = React.useState({
    age: "",
    gender: "",
    bmi: "",
    children: "",
    isSmoker: false,
  });

  const [res, setRes] = React.useState(null);

  function getAndSetData() {
    getData(
      values.age,
      values.gender,
      values.bmi,
      values.children,
      values.isSmoker ? 1 : 0
    )
      .then((data) => {
        setRes(data.charges < 0 ? 0 : data.charges);
      })
      .catch((e) => {
        if (e) {
          setRes("Unable to fetch data from server!");
        }
      });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getAndSetData();
  };

  React.useEffect(() => {
    if (
      values.age &&
      Number(values.gender) in [0, 1] &&
      values.bmi &&
      Number(values.children) >= 0
    )
      getAndSetData();
  }, [values]);

  const handleInputChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleBlur = () => {
    if (values.bmi < 0) {
      setValues({ ...values, bmi: 0 });
    } else if (values.bmi > 50) {
      setValues({ ...values, bmi: 50 });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Paper
          variant="filled"
          style={{ padding: 32, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
        >
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <HealthAndSafetyOutlinedIcon sx={{ color: "#fff" }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              textAlign="center"
              style={classes.text}
            >
              Medical Insurance Cost Prediction
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <CssTextField
                color="primary"
                margin="normal"
                required
                fullWidth
                id="age"
                label="Age"
                name="age"
                autoComplete="age"
                value={values.age}
                onChange={handleInputChange("age")}
                inputProps={{
                  type: "number",
                }}
              />
              <FormControl required fullWidth margin="normal">
                <InputLabel id="gender">Gender</InputLabel>
                <Select
                  color="primary"
                  labelId="gender"
                  id="gender"
                  label="Gender"
                  onChange={handleInputChange("gender")}
                >
                  <MenuItem value={1}>Male</MenuItem>
                  <MenuItem value={0}>Female</MenuItem>
                </Select>
              </FormControl>
              <Typography id="input-slider" marginTop={2}>
                BMI (Basic Metabolism Index)
              </Typography>
              <Grid container spacing={5} alignItems="center" paddingTop={2}>
                <Grid item xs>
                  <Slider
                    color="primary"
                    style={{ marginLeft: 15 }}
                    max={50}
                    value={typeof values.bmi === "number" ? values.bmi : 0}
                    onChange={handleInputChange("bmi")}
                    aria-labelledby="input-slider"
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item>
                  <TextField
                    color="primary"
                    required
                    value={values.bmi}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                      step: 5,
                      min: 0,
                      max: 50,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </Grid>
              </Grid>
              <CssTextField
                color="primary"
                required
                margin="normal"
                fullWidth
                label="Children"
                helperText="No. of children"
                value={values.children}
                inputProps={{
                  step: 1,
                  min: 0,
                  type: "number",
                  "aria-labelledby": "input-slider",
                }}
                onChange={handleInputChange("children")}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={values.isSmoker}
                    onChange={() => {
                      setValues({ ...values, isSmoker: !values.isSmoker });
                    }}
                  />
                }
                label="Is smoker? "
              />

              <Button
                size="large"
                color="primary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Predict
              </Button>
              {res && (
                <Grow
                  in={Boolean(res)}
                  style={{ transformOrigin: "0 0 0" }}
                  {...(res ? { timeout: 1000 } : {})}
                >
                  <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                    {Number(res)
                      ? `Approx cost: $${Number(res).toFixed(2)}`
                      : res}
                  </Typography>
                </Grow>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
      <Copyright sx={{ mt: 2 }} />
    </ThemeProvider>
  );
}
