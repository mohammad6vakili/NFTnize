import classNames from "classnames"
import { Header, Footer } from "new_components"
import classes from "./Layout.module.scss"

export const Layout = ({
  children,
  container,
  containerFullWidth,
  className,
  hideFooter,
}) => (
  <div className={classes.layout}>
    <Header />

    <main
      className={classNames(
        classes.main,
        container && classes["main--container"],
        containerFullWidth && classes["main--container-full-width"],
        className
      )}
    >
      {children}
    </main>

    {hideFooter ? null : <Footer />}
  </div>
)
