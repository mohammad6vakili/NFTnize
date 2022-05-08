import classNames from "classnames"
import { Header, Footer, Breadcrumb } from "components"
import classes from "./Layout.module.scss"

export const Layout = ({
  children,
  className,
  breadcrumb,
  handleThemeSwitch,
}) => (
  <div className={classes.layout}>
    <div className={classes.container}>
      <Header handleSwitchTheme={handleThemeSwitch} />
      {breadcrumb && (
        <Breadcrumb paths={breadcrumb} className={classes.breadcrumb} />
      )}
      <main className={classNames(classes.main, className)}>{children}</main>
      <Footer />
    </div>
  </div>
)
