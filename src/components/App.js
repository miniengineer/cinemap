import React from "react";
import "./App.css";

//material-ui
import { Container, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      cinemas: [
        {
          movie: "Joker",
          name: "Wald9",
          latitude: "99999",
          lontitude: "11111",
          address: "Shinjuku-ku, Shinjuku 1-3-5",
          showtimes: ["2019-11-19T10:40:00+09:00", "2019-11-24T15:15:00+09:00"]
        }
      ],
      movieInfo: {
        imageUrl:
          "http://image.tmdb.org/t/p/w154/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        imdbRating: "6.5",
        summary: "awesome movie"
      }
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Container maxWidth="md">
        <p>Cookies</p>
        <TextField
          id="outlined-basic"
          className={classes.textField}
          label="Movie Title"
          margin="normal"
          variant="outlined"
        />
        {/* Map goes here */}
        {/* CinemaList goes here */}
      </Container>
    );
  }
}

export default withStyles(styles)(App);
