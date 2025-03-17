import styles from "@/styles/Home.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      {children}

      <footer className={styles.footer}>
        <p>Acme Secret Santa Generator &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
