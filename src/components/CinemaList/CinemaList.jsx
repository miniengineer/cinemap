import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Chip
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
// import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { faUmbrella } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles";

const weatherIcons = {
  "clear-day": faSun,
  overcast: faCloud,
  rain: faUmbrella
};

function CinemaList(props) {
  const days = props.cinemas.map(cinema =>
    cinema.showtimes.map(showtime =>
      new Date(showtime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    )
  );

  console.log(days);
  const { classes } = props;
  console.log(props.movieInfo.imageUrl);

  return (
    <React.Fragment>
      {/* MOVIE INFO */}
      <br />
      <br />
      <Typography gutterBottom variant="h5" component="h2">
        MOVIE INFO
      </Typography>
      <br />
      <Grid item xs={12}>
        <Card className={classes.card} xs="12">
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              src="https://dazedimg-dazedgroup.netdna-ssl.com/900/azure/dazed-prod/1270/8/1278472.jpg"
              title={props.movieInfo.movie.toUpperCase()}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h4">
                {props.movieInfo.movie.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="textPrimary" component="p">
                {props.movieInfo.summary}
              </Typography>
              <br />
              <Typography
                className={classes.alignLeft}
                gutterBottom
                variant="h5"
                component="h2"
              ></Typography>
              <br />
              <Typography
                className={classes.alignLeft}
                variant="h6"
                component="h4"
              >
                <Chip
                  size="medium"
                  label={props.movieInfo.imdbRating + " IMDB"}
                >
                  {" "}
                </Chip>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      {/* CINEMAS */}
      <br />
      <br />
      <Typography gutterBottom variant="h5" component="h2">
        CINEMAS SHOWING {props.movieInfo.movie.toUpperCase()}
      </Typography>
      <br />
      <Grid container spacing={3} justify="center" alignItems="center">
        {props.cinemas.map((cinema, i) => {
          return (
            <Grid item xs="12">
              <Card id="cinema-card" className={classes.card}>
                <CardContent>
                  <br />
                  <br />
                  <Typography gutterBottom variant="h5" component="h4">
                    {cinema.name}
                  </Typography>
                  {cinema.address}
                  <br />
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justify="space-around"
                    alignItems="center"
                  >
                    {cinema.showtimes
                      .map(showtime =>
                        new Date(showtime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                          // year: "numeric"
                        })
                      )
                      .filter((date, i, dates) => dates.indexOf(date) === i)
                      .map(showtime => (
                        <Grid
                          item
                          container
                          spacing={3}
                          direction="row"
                          justify="space-around"
                          alignItems="flex-start"
                        >
                          <Grid item xs="12" id="day-card">
                            <Card className={classes.card}>
                              <CardActionArea focusHighlight="">
                                <CardContent>
                                  <Grid
                                    container
                                    spacing={3}
                                    direction="row"
                                    justify="space-around"
                                    alignItems="flex-start"
                                  >
                                    <Grid item xs="4" id="day-card">
                                      {/* <FontAwesomeIcon
                                        icon={faCloud}
                                        color="indigo"
                                      />
                                      <FontAwesomeIcon
                                        icon={faUmbrella}
                                        color="indigo"
                                      />
                                      <FontAwesomeIcon
                                        icon={faSun}
                                        color="indigo"
                                      /> */}
                                      <h2 id="day-title">{showtime}</h2>
                                      <h2 id="day-title">
                                        {props.weather.map(day => {
                                          if (day.time === showtime) {
                                            return (
                                              <FontAwesomeIcon
                                                icon={weatherIcons[day.icon]}
                                                color="indigo"
                                              />
                                            );
                                          }
                                        })}
                                      </h2>
                                    </Grid>
                                    <Grid item xs="8" id="day-card">
                                      {cinema.showtimes
                                        .map(showtime =>
                                          new Date(showtime).toLocaleDateString(
                                            "en-US",
                                            {
                                              month: "short",
                                              day: "numeric",
                                              hour: "numeric",
                                              minute: "numeric"
                                            }
                                          )
                                        )
                                        .filter(
                                          (date, i, dates) =>
                                            date.split(",")[0] === showtime
                                        )
                                        .map(showtime => (
                                          <Chip
                                            clickable
                                            id="showtime-chip"
                                            size="medium"
                                            label={showtime
                                              .split(" ")[2]
                                              .concat(showtime.split(" ")[3])}
                                            color="primary"
                                          ></Chip>
                                        ))}
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );
}

export default withStyles(styles)(CinemaList);
