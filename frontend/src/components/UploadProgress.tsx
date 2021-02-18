// @flow 
import { CircularProgress, Fade, makeStyles, Theme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import * as React from 'react';
import { hasError } from '../store/upload/getters';
import { FileUpload, Upload } from '../store/upload/types';

const useStyles = makeStyles((theme: Theme)=> ({
  progressContainer: {
    position: 'relative'
  },
  progress: {
    position: 'absolute',
    left: 0
  },
  progressBackground: {
    color: grey["300"]
  }
}));

interface UploadProgressProps {
  size: number;
  uploadOrFile: Upload | FileUpload;
};
const UploadProgress = (props: UploadProgressProps) => {
  const {size, uploadOrFile} = props;
  const classes = useStyles();
  const error = hasError(uploadOrFile);
  return (
    <Fade in={uploadOrFile.progress < 1} timeout={{enter: 100, exit: 2000}}>
      <div className={classes.progressContainer}>
        <CircularProgress
          variant="static"
          value={100}
          className={classes.progressBackground}
          size={size}
        />
        <CircularProgress
          variant="static"
          className={classes.progress}
          value={error ? 0: uploadOrFile.progress * 100}
          size={size}
        />
        
      </div>
    </Fade>
  );
};

export default UploadProgress;