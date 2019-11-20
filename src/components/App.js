import React from "react";
import "./App.css";

//components
import Map from "./Map/Map";
import CinemaList from "./CinemaList/CinemaList";
import cinemapLogoIcon from "../assets/cinemap-logo-white-v.png";

//material-ui
import { Container, TextField, AppBar, Grid, Fab } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import locations from "../data/locations";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedMovie: "",
      cinemas: [
        {
          movie: "Joker",
          name: "Wald9",
          latitude: "99999",
          lontitude: "11111",
          address: "Shinjuku-ku, Shinjuku 1-3-5",
          showtimes: ["2019-11-19T10:40:00+09:00", "2019-11-24T15:15:00+09:00"]
        },
        {
          movie: "Joker",
          name: "Wald9",
          latitude: "99999",
          lontitude: "11111",
          address: "Shibuya-ku, Minamiaoyama 2-5-10",
          showtimes: ["2019-11-19T10:40:00+09:00", "2019-11-24T15:15:00+09:00"]
        }
      ],
      movieInfo: {
        movie: "Joker",
        imageUrl:
          "http://image.tmdb.org/t/p/w154/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        imdbRating: "8.8",
        summary:
          "Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he's part of the world around him. Isolated, bullied and disregarded by society, Fleck begins a slow descent into madness as he transforms into the criminal mastermind known as the Joker."
      },
      locations,
      isCinemaListShown: true
    };
  }

  handleMovieInput = e => {
    if (e.key === "Enter") {
      this.setState({ selectedMovie: e.target.value, isCinemaListShown: true });
      e.target.value = "";
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Container className="App" maxWidth="md">
        <AppBar className={classes.appBar}>
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item id="home" xs={3}>
              <h3>HOME</h3>
            </Grid>

            <Grid item xs={6}>
              <img width="100%" src={cinemapLogoIcon}></img>
            </Grid>

            <Grid item xs={3} id="about">
              <h3>ABOUT</h3>
            </Grid>
          </Grid>
        </AppBar>
        <div className="search" height="25%">
          <TextField
            id="filled-basic"
            className={classes.textField}
            margin="normal"
            variant="filled"
            label="What are we watching? 🎥"
            placeholder='Type a movie name, e.g. "Jurassic Park" 🦖 '
            onKeyDown={this.handleMovieInput}
          />
          <Fab color="primary" aria-label="search" className={classes.fab}>
            <SearchIcon />
          </Fab>
        </div>

        <Map locations={this.state.locations}></Map>
        {this.state.isCinemaListShown ? (
          <CinemaList
            cinemas={this.state.cinemas}
            movieInfo={this.state.movieInfo}
          />
        ) : null}
      </Container>
    );
  }
}

export default withStyles(styles)(App);
