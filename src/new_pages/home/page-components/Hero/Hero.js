/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useRef, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { Carousel } from "react-responsive-carousel"
import { animateScroll as scroll } from "react-scroll"
import classNames from "classnames"
import { Button, OwnerBadge, RadioGroup, RadioButton } from "new_components"
import { formatDuration, timeDiffAsSec, formatURL } from "utils/helper"
import { ReactComponent as AlgoLogoIcon } from "new_assets/icons/algo-logo.svg"
import { ReactComponent as ArrowRightIcon } from "new_assets/icons/arrow-right.svg"
// import { ReactComponent as ArrowRightSmallIcon } from "new_assets/icons/arrow-right-small.svg"
// import { ReactComponent as ArrowLeftSmallIcon } from "new_assets/icons/arrow-left-small.svg"
import { ReactComponent as HomeHeroCircle } from "new_assets/shapes/circle.svg"
import { ReactComponent as HomeHeroGround } from "new_assets/shapes/ground.svg"
import HeroImage1 from "../../page-assets/home-hero-1.png"
import ProfileLogo from "../../../../assets/logos/profile.png"
import classes from "./Hero.module.scss"

export const Hero = () => {
  const cardRef = useRef(null)
  const containerRef = useRef(null)
  const history = useHistory()
  const [timeCounter, setTimeCounter] = useState(0)

  const applications = useSelector((state) => state.application.applications)
  const [highestApplications, setHighestApplications] = useState([])
  const [applicationMediaTypes, setApplicationMediaTypes] = useState([])
  const [applicationURLs, setApplicationURLs] = useState([])
  const [applicationTimeDiffs, setApplicationTimeDiffs] = useState([])
  const [selectedApplicationIndex, setSelectedApplicationIndex] = useState(0)

  useEffect(() => {
    if (applications && applications.length > 0) {
      const temp = Array.from(
        applications.filter((auction) => new Date(auction.endTime) > new Date())
      )
        .sort((a, b) => Number(b.currentPrice) - Number(a.currentPrice))
        .slice(0, 3)
      const promises = temp.map((application) =>
        formatURL(application.nft.metadata.image)
      )
      Promise.all(promises).then((urls) => {
        const mediaTypes = []
        const mediaURLs = []
        const timeDiffs = []
        urls.forEach((url, index) => {
          mediaURLs.push(url)
          mediaTypes.push("img")
          const diff = timeDiffAsSec(temp[index].endTime)
          timeDiffs.push(diff > 0 ? diff : 0)
        })
        setApplicationMediaTypes(mediaTypes)
        setApplicationURLs(mediaURLs)
        setApplicationTimeDiffs(timeDiffs)
        setHighestApplications(temp)
        setSelectedApplicationIndex(0)
      })
    }
  }, [applications])
  useEffect(() => {
    window.carouselInterval = setInterval(() => {
      if (highestApplications.length > 0) {
        setSelectedApplicationIndex(
          (state) => (state + 1) % highestApplications.length
        )
      }
    }, 5000)
    return () => clearInterval(window.carouselInterval)
  }, [highestApplications])
  useEffect(() => {
    clearInterval(window.carouselInterval)
    window.carouselInterval = setInterval(() => {
      if (highestApplications.length > 0) {
        setSelectedApplicationIndex(
          (state) => (state + 1) % highestApplications.length
        )
      }
    }, 5000)
    return () => clearInterval(window.carouselInterval)
  }, [selectedApplicationIndex])
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeCounter(timeCounter + 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeCounter])
  useEffect(() => {
    handleResize()
    // Bind the event listener
    window.addEventListener("resize", handleResize)
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  const handleBidClick = () => {
    const route = highestApplications[selectedApplicationIndex]?.appId
      ? `/buy/${highestApplications[selectedApplicationIndex].appId}`
      : "/buy?type=live"
    history.push(route)
  }
  const handleResize = () => {
    if (window.innerWidth < 600) {
      containerRef.current.style.paddingBottom = `${
        (60 / 100) * cardRef.current.offsetHeight
      }px`
    } else {
      containerRef.current.style.paddingBottom = "unset"
    }
  }

  const exploreCollections = () => {
    // history.push(`/markets`)
    history.push(`/buy?type=live`)
    scroll.scrollToTop()
  }
  const onCarouselChanges = (index) => {
    setSelectedApplicationIndex(index)
    handleResize()
  }

  const stitchbobAddress =
    "MNGOLDXO723TDRM6527G7OZ2N7JLNGCIH6U2R4MOCPPLONE3ZATOBN7OQM"

  return (
    <div className={classes.container} ref={containerRef}>
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

          <p className={classes.info__subtitle}>
            The premier NFT marketplace powered by{" "}
            <span className={classes.polygon}>Polygon</span> and{" "}
            <span className={classes.polygon}>Ethereum</span>
            &nbsp;-&nbsp;start&nbsp;
            <a href="/">here</a>.
          </p>

          <Button onClick={exploreCollections}>Explore Market</Button>
        </div>

        <div className={classes.figures}>
          <div className={classes["figures__image-container"]}>
            <ArrowRightIcon />

            {highestApplications.length > 0 ? (
              <Carousel
                className={classes.figures__carousel}
                onChange={onCarouselChanges}
                showThumbs={false}
                showStatus={false}
                useKeyboardArrows
                selectedItem={selectedApplicationIndex}
                showIndicators={false}
                showArrows={false}
              >
                {highestApplications.map((highestApplication, index) => (
                  <div
                    key={`topApplication-${index}`}
                    className={classes.figures__nft}
                  >
                    <Link
                      to={`creators/${highestApplication.nft.token.creator}`}
                      className={classes.creator_link}
                    >
                      <OwnerBadge
                        img={applicationURLs[index]}
                        id={highestApplication.nft.metadata.name.toLowerCase()}
                        className={classes["figures__nft-owner"]}
                      />
                    </Link>

                    {applicationMediaTypes[index] === "video" ? (
                      <div className={classes.figures__media}>
                        {[1, 2].map((key) => (
                          <video
                            key={key}
                            preload="auto"
                            autoPlay
                            loop
                            muted
                            onClick={() => handleBidClick()}
                          >
                            <source
                              src={applicationURLs[index]}
                              type="video/mp4"
                            />
                          </video>
                        ))}
                      </div>
                    ) : (
                      <div className={classes.figures__media}>
                        {[1, 2].map((key) => (
                          <img
                            key={key}
                            onClick={() => handleBidClick()}
                            src={applicationURLs[index]}
                            alt=""
                            onError={() => {
                              const temp = [...applicationMediaTypes]
                              temp[index] = "video"
                              setApplicationMediaTypes([...temp])
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className={classes.figures__image}>
                <Link
                  to={`creators/${stitchbobAddress}`}
                  className={classes.dummy_creator_link}
                >
                  <OwnerBadge
                    img={ProfileLogo}
                    id="stitchbob"
                    className={classes["figures__image-owner"]}
                  />
                </Link>
                <div className={classes.figures__media}>
                  <img src={HeroImage1} alt="" />
                  <img src={HeroImage1} alt="" />
                </div>
              </div>
            )}
          </div>

          <div
            className={classNames(
              classes.card,
              highestApplications.length > 1 && classes.paddingTopSmall
            )}
            ref={cardRef}
          >
            {highestApplications.length > 1 && (
              <RadioGroup
                onChange={(e) => {
                  setSelectedApplicationIndex(parseInt(e, 10))
                }}
                selected={selectedApplicationIndex}
                horizontal
                center
                closer
              >
                {highestApplications.map((_application, index) => (
                  <RadioButton
                    value={index}
                    name={index}
                    key={`radio-button-${index}`}
                    size="small"
                  />
                ))}
              </RadioGroup>
            )}
            <div className={classes.card__header}>
              <span className={classes.card__title}>
                {highestApplications[selectedApplicationIndex]
                  ? `${highestApplications[selectedApplicationIndex].nft.metadata.name} #${highestApplications[selectedApplicationIndex].appId}`
                  : `Yieldling Rare #017`}
              </span>
              {highestApplications[selectedApplicationIndex] ? (
                <Link
                  to={`creators/${highestApplications[selectedApplicationIndex].nft.token.creator}`}
                  className={classes.creator_link}
                >
                  <OwnerBadge
                    img={applicationURLs[selectedApplicationIndex]}
                    id={highestApplications[
                      selectedApplicationIndex
                    ].nft.metadata.name.toLowerCase()}
                  />
                </Link>
              ) : (
                <Link
                  to={`creators/${stitchbobAddress}`}
                  className={classes.creator_link}
                >
                  <OwnerBadge img={ProfileLogo} id="stitchbob" />
                </Link>
              )}
            </div>

            <p className={classes.card__text}>
              {highestApplications[selectedApplicationIndex]
                ? highestApplications[selectedApplicationIndex].nft.metadata
                    .description
                : ""}
            </p>

            <div className={classes.card__actions}>
              <Button onClick={handleBidClick}>Bid</Button>
              <div className={classes.card__action}>
                <span>Current Bid</span>
                <span>
                  <AlgoLogoIcon />
                  {highestApplications[selectedApplicationIndex]
                    ? highestApplications[selectedApplicationIndex].currentPrice
                    : 3.2}
                  &nbsp; ALGO
                </span>
              </div>
              <div className={classes.card__action}>
                <span>Ending In</span>
                {applicationTimeDiffs ? (
                  applicationTimeDiffs[selectedApplicationIndex] === 0 ? (
                    <span>Auction Closed</span>
                  ) : (
                    formatDuration(
                      applicationTimeDiffs[selectedApplicationIndex] -
                        timeCounter
                    )
                  )
                ) : (
                  `8h 14m 24s`
                )}
                {/* <span>{formatDuration(timeCounter)}</span>
                <span>8h 14m 24s</span> */}
              </div>
            </div>
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
