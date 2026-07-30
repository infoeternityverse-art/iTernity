export function SparkLoader({ label = 'It all starts with a spark', fullScreen = true }) {
  return (
    <div className={fullScreen ? 'spark-loader spark-loader-fullscreen' : 'spark-loader'}>
      <div className="spark-loader-inner" role="status" aria-live="polite">
        <span className="spark-loader-steps" aria-hidden="true" />
        <span className="spark-loader-text">{label}</span>
      </div>
    </div>
  );
}
