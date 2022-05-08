import classes from "./Footer.module.scss"

export const Footer = () => (
  <footer className={classes.footer}>
    YNFT CLUB {new Date().getFullYear()}, All right received
  </footer>
)
