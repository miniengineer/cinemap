import React from "react";
import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

function CinemaList(props) {
  const { classes } = props;
  console.log(props.movieInfo.imageUrl);
  return props.cinemas.map((cinema, i) => {
    return (
      <Card key={i} className={classes.card}>
        <CardActionArea>
          <CardMedia component="img" height="140" src="https://dazedimg-dazedgroup.netdna-ssl.com/900/azure/dazed-prod/1270/8/1278472.jpg" title={cinema.movie} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" >{cinema.movie}</Typography>
            <Typography variant="body2" color="textPrimary" component="p">{props.movieInfo.summary}</Typography>
            <br />
            <Typography className={classes.alignLeft} gutterBottom variant="h5" component="h2">Cinema: {cinema.name}</Typography>
            <br />
            {cinema.showtimes.map(showtime => <Typography className={classes.alignLeft} variant="body1" color="textPrimary" component="p">{new Date(showtime).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
               })}</Typography>)}
            <br />
            <Typography className={classes.alignLeft} variant="h8" component="h2" >{props.movieInfo.imdbRating} IMDB</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  });
}

export default withStyles(styles)(CinemaList);
