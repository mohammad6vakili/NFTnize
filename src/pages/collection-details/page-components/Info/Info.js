import classes from "./Info.module.scss"
import { Link } from "react-router-dom"
import { ReactComponent as VerifiedIcon } from "assets/icons/verified.svg"
import { ReactComponent as TwitterIcon } from "assets/icons/twitter.svg"
import { ReactComponent as FacebookIcon } from "assets/icons/facebook.svg"

export const Info = ({ collection }) => (
  <section className={classes.info}>
    <h1 className={classes.title}>{collection.name}</h1>

    <p className={classes.owner}>
      Created&nbsp;
      <Link to={`/v1/creators/${collection.creatorAddress}`}>
        {collection.creator}
      </Link>{" "}
      <VerifiedIcon />
    </p>

    <div className={classes.socials}>
      <a href="https://twitter.com">
        <TwitterIcon />
      </a>
      <a href="https://facebook.com">
        <FacebookIcon />
      </a>
    </div>

    <p className={classes.desc}>
      An artist dedicated to illustrating, and bringing to life, the true heroes
      of the Algorand blockchain realm. This is unofficial parody art and not
      affiliated with DBZ.
    </p>
  </section>
)
