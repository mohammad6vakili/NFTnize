import { useEffect, useState } from "react"
import classNames from "classnames"
import classes from "./Hero.module.scss"
import { Button, TextField } from "new_components"
import { useHistory } from "react-router-dom"
import { ReactComponent as HomeHeroCircle } from "new_assets/shapes/circle.svg"
import { ReactComponent as HomeHeroGround } from "new_assets/shapes/ground.svg"
import { accessCodes, codeExpireCount } from "utils/accessCode"
import { useDispatch, useSelector } from "react-redux"
import { setAccessCode as setStoreAccessCode } from "redux/accessCode/accessCode"
import {
  createAccessHistory,
  getAccessCodeHistoryCount,
} from "new_services/AccessHistoryService"

const Hero = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const storeAccessCode = useSelector((state) => state.accessCode.accessCode)

  useEffect(() => {
    if (accessCodes.includes(storeAccessCode)) {
      history.push("/")
    }
  }, [])

  const handleAccess = async () => {
    if (accessCodes.includes(accessCode)) {
      setError("")
      const { data: accessCount } = await getAccessCodeHistoryCount({
        code: accessCode,
      })
      if (accessCount < codeExpireCount) {
        createAccessHistory({ code: accessCode })
        dispatch(setStoreAccessCode(accessCode))
        history.push("/")
      } else {
        setError("This access code is expired.")
      }
    } else {
      setError("Access code is not valid.")
    }
  }

  return (
    <div className={classes.container}>
      <section className={classes.hero}>
        <div className={classes.info}>
          <h1 className={classes.info__title}>
            <span
              className={classNames(
                classes.info__title,
                classes["info__title--pink"]
              )}
            >
              NFTnize, List, Collect
            </span>
            <span
              className={classNames(
                classes.info__title,
                classes["info__title--blue"]
              )}
            >
              Auction & Trade
            </span>
            <span
              className={classNames(
                classes.info__title,
                classes["info__title--pink"]
              )}
            >
              NFTs of Arts and Collectables.
            </span>
          </h1>
        </div>

        <div className={classes.card}>
          <div className={classes.card__header}>
            <span className={classes.card__title}>Private Alpha Access</span>
          </div>

          <TextField
            required
            error={error}
            type="text"
            value={accessCode}
            placeholder="Access Code"
            onChange={(e) => setAccessCode(e.target.value)}
            capitalizeLabel
            pinkBorder
            className={classes.card__input}
          />

          <div className={classes.card__actions}>
            <Button onClick={handleAccess}>Enter Now</Button>
          </div>
        </div>
      </section>

      <HomeHeroCircle className={classes["circle-shape"]} />
      <div className={classes["ground-shape"]}>
        <div />
        <HomeHeroGround />
      </div>
    </div>
  )
}

export default Hero
