
import styles from "./components/account.module.css";
import AccountPage from "./components/account-page";

export default function Home() {
  return (
    <main className={styles.accountTheme}>
      <AccountPage />
    </main>
  );
}
