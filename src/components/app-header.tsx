import styles from './app-header.module.css'

export function AppHeader() {
  return (
    <header className={styles.appHeader}>
      <h1 className={styles.appTitle}>Baseline feature dashboard</h1>
      <p className={styles.appSubtitle}>
        Keep an eye on Baseline status from{' '}
        <a
          href="https://webstatus.dev"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.appLink}
        >
          webstatus.dev
        </a>
        .
      </p>
    </header>
  )
}
