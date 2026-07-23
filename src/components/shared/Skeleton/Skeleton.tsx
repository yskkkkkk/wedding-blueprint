import classes from './Skeleton.module.css';

export default function Skeleton() {
  return (
    <div className={classes.skeletonContainer}>
      {/* Cover Image Skeleton */}
      <div className={`${classes.skeletonBox} ${classes.coverImage}`}></div>
      
      {/* Title Skeleton */}
      <div className={classes.titleWrapper}>
        <div className={`${classes.skeletonBox} ${classes.title}`}></div>
        <div className={`${classes.skeletonBox} ${classes.subtitle}`}></div>
      </div>
      
      {/* Paragraph Skeleton */}
      <div className={classes.paragraphWrapper}>
        <div className={`${classes.skeletonBox} ${classes.line}`}></div>
        <div className={`${classes.skeletonBox} ${classes.line}`}></div>
        <div className={`${classes.skeletonBox} ${classes.line} ${classes.shortLine}`}></div>
      </div>
    </div>
  );
}
