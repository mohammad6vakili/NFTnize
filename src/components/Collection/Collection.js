/* eslint-disable camelcase */
import { Link } from "react-router-dom"
import classes from "./Collection.module.scss"
import { useEffect, useState } from "react"
import { formatURL } from "utils/helper"
import { LazyLoadImage } from "react-lazy-load-image-component"

export const Collection = ({
  id,
  creator,
  name,
  type,
  price,
  collection_dashboard,
}) => {
  const [images, setImages] = useState([])

  useEffect(() => {
    let mounted = true

    const format = async () => {
      const resultArr = []
      if (
        type !== "compact-owner" &&
        type !== "compact-price" &&
        type !== "compact-list"
      ) {
        const imageArr = []
        if (collection_dashboard) {
          imageArr.push(collection_dashboard.image1)
          imageArr.push(collection_dashboard.image2)
          imageArr.push(collection_dashboard.image3)
          imageArr.push(collection_dashboard.image4)
        }
        for (let index = 0; index < imageArr.length; index++) {
          const element = imageArr[index]
          /* eslint-disable no-await-in-loop */
          const response = await formatURL(element)
          resultArr.push(response)
        }
        if (mounted) setImages(resultArr)
      }
    }
    format()

    return () => {
      mounted = false
    }
  }, [])

  /* 
    type: 'compact-owner' or 'compact-price', 'list'
  */
  if (type === "compact-owner" || type === "compact-price") {
    return (
      <div
        className={
          type === "compact-owner"
            ? classes["compact-owner"]
            : classes["compact-price"]
        }
      >
        <LazyLoadImage
          src="https://unsplash.it/100/100"
          alt={`${creator} avatar`}
        />
        <Link to={`/v1/collection/${id}`}>{name}</Link>
        <span>{type === "compact-owner" ? `${creator}` : price}</span>
      </div>
    )
  }

  if (type === "compact-list") {
    return (
      <div className={classes["compact-list"]}>
        <div className={classes["compact-list-figures"]}>
          {images.map((img, index) => (
            <LazyLoadImage
              src="https://unsplash.it/300/300"
              alt=""
              key={index}
            />
          ))}
        </div>
        <Link to={`/v1/collection/${name}`}>{name}</Link>
        <div className={classes["compact-list-owner"]}>
          <LazyLoadImage
            src="https://unsplash.it/100/100"
            alt={`${creator} avatar`}
          />
          <span>{creator}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.collection}>
      <div className={classes.figures}>
        {images &&
          images.length === 4 &&
          images.map((img, index) => (
            <Link to="/v1/home" key={index}>
              <LazyLoadImage src={img} alt={img} key={img} />
            </Link>
          ))}
        {images &&
          images.length > 0 &&
          images.length < 4 &&
          images.map((img, idx) => (
            <Link to="/v1/home" key={idx}>
              <LazyLoadImage src={img} alt={img} key={img} />
            </Link>
          ))}
      </div>

      <div className={classes.info}>
        <Link className={classes.name} to={`/collection/${name}`}>
          {name}
        </Link>
        <div className={classes.owner}>
          <LazyLoadImage
            src="https://unsplash.it/100/100"
            alt={`${creator} avatar`}
          />
          <span>{creator}</span>
        </div>
      </div>
    </div>
  )
}
