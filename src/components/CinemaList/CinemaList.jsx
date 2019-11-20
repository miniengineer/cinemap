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
import styles from "./styles";

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
                        })
                      )
                      .filter((date, i, dates) => dates.indexOf(date) === i)
                      .map(showtime => (
                        <Grid
                          item
                          xs="4"
                          container
                          spacing={3}
                          direction="row"
                          justify="flex-start"
                          alignItems="flex-start"
                        >
                          <Grid item xs="12" id="day-card">
                            <Card className={classes.card}>
                              <CardActionArea focusHighlight="">
                                <CardContent>
                                  <h4>{showtime}</h4>
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
                                        size="small"
                                        label={showtime.split(" ")[2]}
                                        color="primary"
                                      ></Chip>
                                    ))}
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
