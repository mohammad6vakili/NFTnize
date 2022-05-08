import classes from "./ComingSoonModal.module.scss"
import { BaseModal, Button } from "new_components"

export const ComingSoonModal = ({ isOpen, onClose }) => (
  <BaseModal isOpen={isOpen} onClose={onClose}>
    <div className={classes.container}>
      <h2 className={classes.title}>Coming Soon</h2>
      <p className={classes.desc}>The functionality is coming soon.</p>
      {/* <TextField
        type="number"
        label="MInimum Bid 20.23 ALGO"
        labelAccent="pink"
      /> */}
      <Button className={classes.cta} onClick={onClose}>
        OK
      </Button>
      {/* <span className={classes.info}>
        Bid will be held in escrow until there is a higher bid or until the
        application ends
      </span> */}
    </div>
  </BaseModal>
)
