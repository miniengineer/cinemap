const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    width: "90%",
    height: "10%",
    color: "midnightblue",
    borderColor: "red"
  },
  appBar: {
    backgroundColor: "rgb(72, 40, 159)"
  },
  loadingGif: {
    marginTop: theme.spacing(4),
    filter: "hue-rotate(29deg)"
  }
});

export default styles;
