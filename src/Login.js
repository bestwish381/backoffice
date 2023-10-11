import "./Login.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "login@testemail.com" && password === "pg3JMCWT3IHMd5tK") {
      setIsLoggedIn(true);
      /*
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 20);
      document.cookie = `session=true; expires=${expiration.toUTCString()}; path=/`;
      */

      navigate("/user-table");
    } else {
      setErrorMessage("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={logo} alt="Logo" className="login-logo" />

        <Typography variant="button" sx={{ mt: 3, mb: 2 }} className="typo">
          Enter your details to login to your account:
        </Typography>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="email"
            autoFocus
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
          />

          <Grid container className="gridContent">
            <Grid item className="gridContainer">
              <Link href="#" variant="body2" className="pageLink">
                Forgot password?
              </Link>
            </Grid>
          </Grid>

          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
            className="signinButton"
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
