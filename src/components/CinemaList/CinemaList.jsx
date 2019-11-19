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
  const { classes } = props;
  console.log(props.movieInfo.imageUrl);

  return (
    <React.Fragment>
      {/* MOVIE INFO */}
      <Grid item xs="12">
        <Card className={classes.card} xs="12">
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              src="https://dazedimg-dazedgroup.netdna-ssl.com/900/azure/dazed-prod/1270/8/1278472.jpg"
              title={props.movieInfo.movie}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {props.movieInfo.movie}
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

              <br />
              <Typography
                className={classes.alignLeft}
                variant="h8"
                component="h2"
              >
                {props.movieInfo.imdbRating} IMDB
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      {/* CINEMAS */}
      <Grid container spacing={3} justify="center" alignItems="center">
        {props.cinemas.map((cinema, i) => {
          return (
            <Grid item xs="6">
              <Card className={classes.card}>
                <CardActionArea>
                  {/* <CardMedia
                    component="img"
                    height="140"
                    src="https://dazedimg-dazedgroup.netdna-ssl.com/900/azure/dazed-prod/1270/8/1278472.jpg"
                    title={props.movieInfo.movie}
                  /> */}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {cinema.name}
                    </Typography>
                    <br />
                    Showing at:
                    <br />
                    <br />
                    {cinema.showtimes.map(showtime => (
                      <Grid
                        container
                        spacing={1}
                        // justify="center"
                        // alignItems="center"
                      >
                        <Grid item xs="3">
                          <Chip
                            size="small"
                            label={new Date(showtime).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric"
                              }
                            )}
                            color="primary"
                          ></Chip>
                        </Grid>
                      </Grid>
                    ))}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );
}

export default withStyles(styles)(CinemaList);
