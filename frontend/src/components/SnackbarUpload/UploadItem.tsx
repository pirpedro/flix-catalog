// @flow 
import { Divider, ListItem, ListItemIcon, ListItemText, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import MovieIcon from "@material-ui/icons/Movie";
import { Upload } from '../../store/upload/types';
import UploadAction from './UploadAction';
import UploadProgress from '../UploadProgress';
import { hasError } from '../../store/upload/getters';

const useStyles = makeStyles((theme: Theme) => ({
  listItem: {
    paddingTop: '7px',
    paddingBottom: '7px',
    height: '53px'
  },
  listItemText: {
    marginLeft: '6px',
    marginRight: '24px',
    color: theme.palette.text.secondary
  },
  movieIcon: {
    color: theme.palette.error.main,
    minWidth: '40px'
  },
}));

interface UploadItemProps {
  upload: Upload
};
const UploadItem = (props: UploadItemProps) => {
  const {upload} = props
  const classes = useStyles();
  const error = hasError(upload);
  const [itemHover, setItemHover] = React.useState(false);
  return (
    <>
      <Tooltip
        disableFocusListener
        disableTouchListener
        title={
          error ? "Não foi possível fazer upload, clique para mais detalhes" : ""
        }
        placement={"left"}
      >
        <ListItem
          className={classes.listItem}
          button
          onMouseOver={() => setItemHover(true)}
          onMouseLeave={() => setItemHover(false)}
        >
          <ListItemIcon className={classes.movieIcon}>
            <MovieIcon/>
          </ListItemIcon>
          <ListItemText
            className={classes.listItemText}
            primary={
              <Typography noWrap={true} variant={"subtitle2"} color={"inherit"}>
                {upload.video.title}
              </Typography>
            }
          />
          <UploadProgress size={30} uploadOrFile={upload}/>
          <UploadAction upload={upload} hover={itemHover}/>
        </ListItem>
      </Tooltip>
      <Divider component="li"/>
    </>
  );
};

export default UploadItem;