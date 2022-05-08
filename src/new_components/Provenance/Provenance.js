import classes from "./Provenance.module.scss"
import { ComingSoonModal } from "new_components"
import { useState } from "react"

export const Provenance = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleSeeMoreClick = () => {
    setIsOpen(true)
  }
  return (
    <section className={classes.container}>
      <h2 className={classes.title}>Provenance</h2>

      <ul className={classes.list}>
        {[...Array(3).keys()].map((key) => (
          <li className={classes.item} key={key}>
            <img
              src="https://unsplash.it/35/35"
              alt=""
              className={classes.item__avatar}
            />
            <div className={classes.item__info}>
              <span>Bid placed by @jeezy</span>
              <span>1.42 ALGO</span>
              <span>Nov 19, 2021 at 12:49am</span>
              <span>$5,695.38</span>
            </div>
          </li>
        ))}
      </ul>
      <div className={classes["see-more"]} onClick={handleSeeMoreClick}>
        See More
      </div>

      <ComingSoonModal
        isOpen={isOpen}
        // data={alertMessage}
        onClose={() => setIsOpen(false)}
      />
    </section>
  )
}
