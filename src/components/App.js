import React from "react";
import "./App.css";

//components
import Map from "./Map/Map";

//material-ui
import { Container, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import locations from "../data/locations";

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
        },
        {
          movie: "Harry Potter and the Goblet of Fire",
          name: "Wald9",
          latitude: "99999",
          lontitude: "11111",
          address: "Shibuya-ku, Minamiaoyama 2-5-10",
          showtimes: ["2019-11-19T10:40:00+09:00", "2019-11-24T15:15:00+09:00"]
        }
      ],
      movieInfo: [{
        title: "Joker",
        imageUrl:
          "http://image.tmdb.org/t/p/w154/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        imdbRating: "8.8",
        summary: "Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he's part of the world around him. Isolated, bullied and disregarded by society, Fleck begins a slow descent into madness as he transforms into the criminal mastermind known as the Joker."
      }, {
        title: "Harry Potter and the Goblet of Fire",
        imageUrl: "http://image.tmdb.org/t/p/w154/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        imdbRating: "7.7",
        summary: "In his fourth year at Hogwarts, Harry is unwittingly selected to compete in the inter-school Triwizard Tournament. Meanwhile, the wizarding world remains unaware of the ominous rise of dark forces."
      }],
      locations,
      
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Container maxWidth="md">
        <h1>Cinemap 🎥 🗺</h1>
        <TextField
          id="outlined-basic"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          label="Let's go to the cinema! 📽"
          placeholder="What movie do you want to watch? 🎥"
        />
        <Map locations={this.state.locations}></Map>
      </Container>
    );
  }
}

export default withStyles(styles)(App);
