import React, { useState } from "react"
import "../page-assets/FileUpload.css"
import { useSelector } from "react-redux"
import noImage from "../page-assets/no-image.svg"
import noImageLight from "../page-assets/no-image-light.svg"
import closeBlack from "../page-assets/close-black.svg"
import closeWhite from "../page-assets/close-white.svg"

const FileUpload = ({
  title,
  boxWidth,
  boxHeight,
  minHeight,
  mintData,
  setMintData,
  showUnitName,
  showQantity,
  setNftFileUploaded,
}) => {
  const { rootTheme } = useSelector((state) => state.application)
  const [uploadRef, setUploadRef] = useState(null)
  const [imageList, setImageList] = useState("")
  const [fileList, setFileList] = useState([])

  const upload = async (e) => {
    const list = []
    const base64 = await converter(e.target.files[0])
    setMintData({ ...mintData, file: e.target.files[0] })
    setImageList(base64)
    setNftFileUploaded(base64)
    setFileList(base64.split(",")[1])
  }

  function converter(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  return (
    <div
      style={{ width: boxWidth, height: boxHeight, minHeight }}
      className={`mv-file-upload ${
        rootTheme === "light" ? "mv-file-upload-light" : ""
      }`}
    >
      <input
        onChange={upload}
        type="file"
        name="filefield"
        style={{ display: "none" }}
        ref={(fileInput) => setUploadRef(fileInput)}
      />
      {imageList.length > 0 && (
        <button
          className="mv-upload-file-clear"
          type="button"
          onClick={() => {
            setFileList([])
            setImageList("")
            setMintData({ ...mintData, file: "" })
          }}
        >
          {rootTheme === "dark" ? (
            <img src={closeWhite} alt="close" />
          ) : (
            <img src={closeBlack} alt="close" />
          )}
        </button>
      )}
      {imageList.length > 0 && (
        <div
          style={
            rootTheme === "dark"
              ? {
                  textDecoration: "underline",
                  color: "white",
                  marginBottom: "30px",
                  cursor: "pointer",
                }
              : {
                  textDecoration: "underline",
                  color: "black",
                  marginBottom: "30px",
                  cursor: "pointer",
                }
          }
          onClick={() => uploadRef.click()}
        >
          Edit File
        </div>
      )}
      <div
        className={`mv-file-upload-show-file-box ${
          rootTheme === "light" ? "mv-file-upload-show-file-box-light" : ""
        }`}
      >
        {imageList.length > 0 && (
          <img
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            src={imageList}
            alt="uploaded"
          />
        )}
        {imageList.length === 0 && rootTheme === "dark" && (
          <img src={noImage} alt="not uploaded" />
        )}
        {imageList.length === 0 && rootTheme === "light" && (
          <img src={noImageLight} alt="not uploaded" />
        )}
      </div>
      {imageList.length === 0 && (
        <div
          className={
            rootTheme === "dark"
              ? "mv-fileupload-click-to-upload"
              : "mv-fileupload-click-to-upload-light"
          }
          onClick={() => uploadRef.click()}
        >
          {title}
        </div>
      )}
      {imageList.length > 0 && (
        <div
          className={`mv-file-upload-infos ${
            rootTheme === "light" ? "mv-file-upload-infos-light" : ""
          }`}
        >
          {showUnitName === "true" && <div>Unit Name</div>}
          {showUnitName === "true" && <div>{mintData.unitName}</div>}
          {showQantity === "true" && <div>Quantity</div>}
          {showQantity === "true" && <div>{mintData.Quantity}</div>}
        </div>
      )}
    </div>
  )
}
export default FileUpload
