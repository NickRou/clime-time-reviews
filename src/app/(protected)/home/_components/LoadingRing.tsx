import styles from './LoadingRing.module.css'

export function LoadingRing() {
  return (
    <div className="flex items-center justify-center pt-6">
      <div className={styles.loader}></div>
    </div>
  )
}
