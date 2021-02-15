import { Grid, GridProps, IconButton } from '@material-ui/core';
import * as React from 'react';
import DeleteIcon from "@material-ui/icons/Delete";

interface GridSelectedItemProps extends GridProps{
  onDelete: () => void;
};
const GridSelectedItem = (props: GridSelectedItemProps) => {
  const {onDelete, children, ...other} = props;
  return (
    <Grid item {...other}>
      <Grid container alignItems={"center"} spacing={3}>
        <Grid item xs={1}>
          <IconButton size={"small"} color={"inherit"} onClick={onDelete}>
            <DeleteIcon/>
          </IconButton>
        </Grid>
        <Grid item xs={10} md={11}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GridSelectedItem;