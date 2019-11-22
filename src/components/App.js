import React from "react";
import "./App.css";
import axios from "axios";

//components
import Map from "./Map/Map";
import CinemaList from "./CinemaList/CinemaList";
import cinemapLogoIcon from "../assets/cinemap-logo-white-v.png";
import loadingCat from "../assets/loading_cat.gif";

//material-ui
import { Container, TextField, AppBar, Grid, Fab } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
//import locations from "../data/locations";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedMovie: "",
      weather: [
        { time: "Nov 22", icon: "rain" },
        { time: "Nov 23", icon: "rain" },
        { time: "Nov 24", icon: "rain" },
        { time: "Nov 25", icon: "overcast" },
        { time: "Nov 26", icon: "clear-day" },
        { time: "Nov 27", icon: "overcast" },
        { time: "Nov 28", icon: "overcast" }
      ],

      cinemas: null,
      movieInfo: null,
      locations: null,
      isLoading: false,
      isCinemaListShown: false
    };
  }

  handleMovieInput = async e => {
    if (e.target) await this.setState({ selectedMovie: e.target.value });
    if (e.key === "Enter" || e === "search") {
      console.log("Searching...");
      this.setState({ isLoading: true });
      const showtimes = await axios.get(
        `/api/cinemas/${this.state.selectedMovie}`
      );
      const cinemas = showtimes.data.showtimeData.reduce((acc, showtimeArr) => {
        let obj = {};
        obj.movie = this.state.selectedMovie;
        obj.name = showtimeArr[0];
        obj.latitude = showtimeArr[1].latitude;
        obj.longitude = showtimeArr[1].longitude;
        obj.address = showtimeArr[1].address;
        obj.showtimes = showtimeArr[1].showtimes;
        acc.push(obj);
        return acc;
      }, []);
      const movieInfo = {
        movie: this.state.selectedMovie,
        imageUrl: showtimes.data.imdbDataCollection.image_url,
        imdbRating: showtimes.data.imdbDataCollection.rating,
        summary: showtimes.data.imdbDataCollection.summary
      };

      const locations = cinemas.reduce((acc, cinema) => {
        let obj = {};
        obj.name = cinema.name;
        obj.movie = this.state.selectedMovie;
        obj.id = cinema.latitude;
        obj.location = {
          lat: cinema.latitude,
          lon: cinema.longitude,
          address: cinema.address
        };
        obj.showtimes = cinema.showtimes;
        acc.push(obj);
        return acc;
      }, []);

      this.setState(
        {
          cinemas,
          movieInfo,
          locations,
          isCinemaListShown: true,
          isLoading: false
        },
        () => console.log(this.state.cinemas)
      );
    }
  };

  componentDidMount() {}

  render() {
    const { classes } = this.props;

    return (
      <Container className="App" maxWidth="md">
        <AppBar id="app-bar" className={classes.appBar}>
          <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item id="home" xs={3}>
              <h3>HOME</h3>
            </Grid>

            <Grid item xs={6}>
              <img width="70%" src={cinemapLogoIcon}></img>
            </Grid>

            <Grid item xs={3} id="about">
              <h3>ABOUT</h3>
            </Grid>
          </Grid>
        </AppBar>
        <h2 id="welcome">Find where to watch your movie.</h2>
        <div className="search" height="25%">
          <TextField
            id="filled-basic"
            className={classes.textField}
            margin="normal"
            variant="filled"
            label="What are we watching? 🎥"
            placeholder='Type a movie name, e.g. "Jurassic Park" 🦖 '
            onKeyUp={e => {
              this.handleMovieInput(e);
            }}
          />
          <Fab
            onClick={() => {
              this.handleMovieInput("search");
              this.setState({ selectedMovie: "" });
            }}
            color="primary"
            aria-label="search"
            className={classes.fab}
          >
            <SearchIcon />
          </Fab>
        </div>
        {this.state.isLoading ? (
          <img
            src={loadingCat}
            width="300px"
            className={classes.loadingGif}
            alt="loading cat"
          />
        ) : null}

        {this.state.isCinemaListShown ? (
          <div>
            <Map locations={this.state.locations}></Map>
            <CinemaList
              weather={this.state.weather}
              cinemas={this.state.cinemas} // FROM INTERNATIONAL API CALL
              movieInfo={this.state.movieInfo} // FROM IMDB CALL
            />
          </div>
        ) : null}
      </Container>
    );
  }
}

export default withStyles(styles)(App);
