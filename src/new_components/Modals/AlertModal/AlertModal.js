import classes from "./AlertModal.module.scss"
import { BaseModal, Button } from "new_components"

export const AlertModal = ({ isOpen, data, onClose }) => (
  <BaseModal isOpen={isOpen} onClose={onClose} hideCloseIcon>
    <div className={classes.container}>
      <h2 className={classes.title}>{data.title}</h2>
      <p className={classes.desc}>{data.desc}</p>
      {/* <TextField
        type="number"
        label="MInimum Bid 20.23 ALGO"
        labelAccent="pink"
      /> */}
      <Button className={classes.cta} onClick={onClose}>
        I understand
      </Button>
      {/* <span className={classes.info}>
        Bid will be held in escrow until there is a higher bid or until the
        application ends
      </span> */}
    </div>
  </BaseModal>
)
