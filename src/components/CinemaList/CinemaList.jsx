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
            <Typography variant="h5" component="h4" >{props.movieInfo.imdbRating} IMDB</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  });
}

export default withStyles(styles)(CinemaList);
