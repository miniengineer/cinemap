import React from 'react';
import './App.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      cinemas: [{
        movie: 'Joker',
        name: 'Wald9',
        latitude: '99999',
        lontitude: '11111',
        address: 'Shinjuku-ku, Shinjuku 1-3-5',
        showtimes: ["2019-11-19T10:40:00+09:00", "2019-11-24T15:15:00+09:00"]
      }],
      movieInfo: {
        imageUrl: "http://image.tmdb.org/t/p/w154/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        imdbRating: '6.5',
        summary: 'awesome movie'
      }
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <p></p>
      </div>
    );
  }
}

