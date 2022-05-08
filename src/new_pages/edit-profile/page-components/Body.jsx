import React, { useState, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import useWallet from "hooks/useWallet"
import { MetaMask } from "utils/walletConnector/ETHConnector"
import { MetaMaskPolygon } from "utils/walletConnector/PolygonConnector"

import "../page-assets/EditProfile.css"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import Header from "../../landing/page-components/Header"
import Footer from "../../landing/page-components/Footer"
import starIcon from "../page-assets/star.svg"
import SelectArrow from "../../mint/page-components/SelectArrow"
import { Snackbar } from "../../../components/Snackbar/Snackbar"
import { Input, Select, Button, Modal } from "antd"
import { signMessage } from "utils/mint"
import { config } from "utils/config"
import HttpService from "utils/httpService"

const { Option } = Select

const Body = () => {
  const history = useHistory()
  const { rootTheme } = useSelector((state) => state.application)
  const [successModal, setSuccessModal] = useState(false)
  const [imageList, setImageList] = useState("")
  const [uploadRef, setUploadRef] = useState(null)
  const [errorStyle, setErrorStyle] = useState(true)
  const [fileList, setFileList] = useState([])
  const [user, setuser] = useState({})
  const httpservice = new HttpService()
  const [formData, setFormData] = useState({
    file: "",
    name: "",
    username: "",
    bio: "",
    twitter: "",
    instagram: "",
    site: "",
    email: "",
  })

  const { connect, deactive } = useWallet()
  const { active: connected, account, library } = useWeb3React()
  const [validList, setValidList] = useState({
    file: {
      error: false,
    },
    name: {
      error: false,
    },
    username: {
      error: false,
    },
    bio: {
      error: false,
    },
    twitter: {
      error: false,
    },
    instagram: {
      error: false,
    },
    site: {
      error: false,
    },
    email: {
      error: false,
    },
  })
  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const [snackbar, setSnackbar] = useState(snackbarInitValues)

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const upload = async (e) => {
    const list = []
    const base64 = await converter(e.target.files[0])
    setFormData({ ...formData, file: e.target.files[0] })
    setImageList(base64)
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

  const handleValidateForm = () => {
    console.log("handleValidateForm")
    // file validation
    if (formData.file.length === 0) {
      validList.file.error = true
    }
    if (formData.file.length !== 0) {
      validList.file.error = false
    }
    // name validation
    if (formData.name.length === 0) {
      validList.name.error = true
    }
    if (formData.name.length !== 0) {
      validList.name.error = false
    }
    // username validation
    if (formData.username.length === 0) {
      validList.username.error = true
    }
    if (formData.username.length !== 0) {
      validList.username.error = false
    }
    // bio validation
    if (formData.bio.length === 0) {
      validList.bio.error = true
    }
    if (formData.bio.length !== 0) {
      validList.bio.error = false
    }
    // twitter validation
    if (formData.twitter.length === 0) {
      validList.twitter.error = true
    }
    if (formData.twitter.length !== 0) {
      validList.twitter.error = false
    }
    // instagram validation
    if (formData.instagram.length === 0) {
      validList.instagram.error = true
    }
    if (formData.instagram.length !== 0) {
      validList.instagram.error = false
    }
    // site validation
    if (formData.site.length === 0) {
      validList.site.error = true
    }
    if (formData.site.length !== 0) {
      validList.site.error = false
    }
    // email validation
    if (formData.email.length === 0) {
      validList.email.error = true
    }
    if (formData.email.length !== 0) {
      validList.email.error = false
    }
  }

  const updateProfileToserver = async (data, auth) => {
    const url = `${config.url_NFTnize}/user/`
    const form = new FormData()
    if (formData.file !== user.avatar) {
      form.append("ImageProfile", data.file, data.file.name)
    }
    form.append("name", data.name)
    form.append("bio", data.bio)
    form.append("username", data.username)
    form.append("twitter", data.twitter)
    form.append("instagram", data.instagram)
    form.append("blog", data.site)
    form.append("email", data.email)
    form.append("account", account.toLowerCase())
    const res = await httpservice.put(url, form, {
      headers: {
        sign: auth.sign,
        account: auth.account,
      },
    })
    return (
      res.data,
      setSuccessModal(true),
      setTimeout(() => {
        history.push(`/profile/${account}`)
      }, 3000)
    )
  }

  const getUserInfo = async () => {
    const url = `${config.url_NFTnize}/user/${account.toLowerCase()}`
    const res = await httpservice.get(url, {})
    return res.data
  }

  const submitForm = async () => {
    console.log(formData)
    setErrorStyle(false)
    const array = []
    handleValidateForm()
    Object.values(validList).forEach((fields) => {
      array.push(fields.error)
    })
    if (array.indexOf(true) !== -1) {
      console.log(validList)
      showMessage({
        text: "Please check you entered all inputs!",
        color: "error",
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      console.log(formData)
      const auth = await signMessage(account, library)
      await updateProfileToserver(formData, auth)
    }
  }

  const handleSelectedWallet = async (provider = null) => {
    if (
      window.ethereum.networkVersion === "4" ||
      window.ethereum.networkVersion === "1"
    ) {
      await connect(MetaMask)
    } else if (
      window.ethereum.networkVersion === "80001" ||
      window.ethereum.networkVersion === "137"
    ) {
      await connect(MetaMaskPolygon)
    }
  }

  useEffect(() => {
    if (errorStyle === false) {
      setErrorStyle(true)
    }
  }, [errorStyle])

  useEffect(() => {
    if (account) {
      getUserInfo().then((currentuser) => {
        setuser(currentuser.result)
        if (currentuser && currentuser.result) {
          if (currentuser.result.avatar) {
            formData.file = currentuser.result.avatar
          }
          if (currentuser.result.displayName) {
            formData.name = currentuser.result.displayName
          }
          if (currentuser.result.username) {
            formData.username = currentuser.result.username
          }
          if (currentuser.result.bio) {
            formData.bio = currentuser.result.bio
          }
          if (currentuser.result.link) {
            formData.site = currentuser.result.link
          }
          if (currentuser.result.twitter) {
            formData.twitter = currentuser.result.twitter
          }
          if (currentuser.result.instagram) {
            formData.instagram = currentuser.result.instagram
          }
          if (currentuser.result.email) {
            formData.email = currentuser.result.email
          }
        }
        if (currentuser?.result?.avatar) {
          setImageList(
            `${config.url_NFTnize.replace("/api/v1", "/static")}/${
              currentuser.result.avatar
            }`
          )
        }
      })
    }
  }, [])

  return (
    <div className={`mv-edit ${rootTheme === "light" ? "mv-edit-light" : ""}`}>
      <Header />
      <div
        className={`mv-edit-body ${
          rootTheme === "light" ? "mv-edit-body-light" : ""
        }`}
      >
        {connected === true ? (
          <>
            {/* page title */}
            <div>
              <span>Edit profile</span>
              <span>
                You can set preferred display name, create your branded profile
                URL and manage other personal <br /> settings
              </span>
            </div>
            <Modal
              visible={successModal}
              onCancel={() => setSuccessModal(false)}
              closable={false}
            >
              <div
                className={`mv-edit-success ${
                  rootTheme === "light" ? "mv-edit-success-light" : ""
                }`}
              >
                Your profile updated successfully!
              </div>
            </Modal>
            <div>
              <div>
                {/* Name */}
                <div
                  className={`mv-edit-field ${
                    rootTheme === "light" ? "mv-edit-field-light" : ""
                  }`}
                >
                  <div>
                    <span>
                      Display name{" "}
                      {errorStyle === true && validList.name.error === true && (
                        <span className="mv-mint-error-text">
                          Name is required.
                        </span>
                      )}
                    </span>
                    <img src={starIcon} alt="required" />
                  </div>
                  <Input
                    value={user?.displayName}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      setuser({ ...user, displayName: e.target.value })
                    }}
                    placeholder="Enter your display name"
                    id={
                      errorStyle && validList.name.error === true
                        ? "mv-error-border-red"
                        : ""
                    }
                  />
                </div>
                {/* Username */}
                <div
                  className={`mv-edit-field ${
                    rootTheme === "light" ? "mv-edit-field-light" : ""
                  }`}
                >
                  <div>
                    <span>
                      Username{" "}
                      {errorStyle === true &&
                        validList.username.error === true && (
                          <span className="mv-mint-error-text">
                            Username is required.
                          </span>
                        )}
                    </span>
                    <img src={starIcon} alt="required" />
                  </div>
                  <Input
                    value={user?.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value })
                      setuser({ ...user, username: e.target.value })
                    }}
                    placeholder="Enter your username"
                    id={
                      errorStyle && validList.username.error === true
                        ? "mv-error-border-red"
                        : ""
                    }
                  />
                </div>
                {/* Bio */}
                <div
                  className={`mv-edit-field ${
                    rootTheme === "light" ? "mv-edit-field-light" : ""
                  }`}
                >
                  <div>
                    <span>
                      Bio{" "}
                      {errorStyle === true && validList.bio.error === true && (
                        <span className="mv-mint-error-text">
                          Bio is required.
                        </span>
                      )}
                    </span>
                    <img src={starIcon} alt="required" />
                  </div>
                  <Input
                    value={user?.bio}
                    onChange={(e) => {
                      setFormData({ ...formData, bio: e.target.value })
                      setuser({ ...user, bio: e.target.value })
                    }}
                    placeholder="Tell about yourself in a few words"
                    id={
                      errorStyle && validList.bio.error === true
                        ? "mv-error-border-red"
                        : ""
                    }
                  />
                </div>
                {/* Twitter Username */}
                <div
                  className={`mv-edit-field ${
                    rootTheme === "light" ? "mv-edit-field-light" : ""
                  }`}
                  id={
                    errorStyle && validList.twitter.error === true
                      ? "mv-error-border-red-div"
                      : ""
                  }
                >
                  <div>
                    <span>
                      Twitter Username{" "}
                      {errorStyle === true &&
                        validList.twitter.error === true && (
                          <span className="mv-mint-error-text">
                            Twitter username is required.
                          </span>
                        )}
                    </span>
                    <img src={starIcon} alt="required" />
                    <span>
                      Link your Twitter account to gain more trust on the
                      marketplace
                    </span>
                  </div>
                  <Input
                    value={user?.twitter}
                    prefix="@"
                    onChange={(e) => {
                      setFormData({ ...formData, twitter: e.target.value })
                      setuser({ ...user, twitter: e.target.value })
                    }}
                    suffix={
                      <a
                        href="/#"
                        className={`mv-edit-input-suffix ${
                          rootTheme === "light"
                            ? "mv-edit-input-suffix-light"
                            : ""
                        }`}
                      >
                        Link
                      </a>
                    }
                    placeholder="Enter your name in Twitter"
                  />
                </div>
                {/* Instagram Username */}
                <div
                  className={`mv-edit-field ${
                    rootTheme === "light" ? "mv-edit-field-light" : ""
                  }`}
                  id={
                    errorStyle && validList.instagram.error === true
                      ? "mv-error-border-red-div"
                      : ""
                  }
                >
                  <div>
                    <span>
                      Instagram Username{" "}
                      {errorStyle === true &&
                        validList.instagram.error === true && (
                          <span className="mv-mint-error-text">
                            Instagram username is required.
                          </span>
                        )}
                    </span>
                    <img src={starIcon} alt="required" />
                    <span>
                      Link your Instagram account to gain more trust on the
                      marketplace
                    </span>
                  </div>
                  <Input
                    value={user?.instagram}
                    prefix="@"
                    onChange={(e) => {
                      setFormData({ ...formData, instagram: e.target.value })
                      setuser({ ...user, instagram: e.target.value })
                    }}
                    suffix={
                      <a
                        href="/#"
                        className={`mv-edit-input-suffix ${
                          rootTheme === "light"
                            ? "mv-edit-input-suffix-light"
                            : ""
                        }`}
                      >
                        Link
                      </a>
                    }
                    placeholder="Enter your name in Instagram"
                  />
                </div>
                {/* Personal site or portfolio */}
                <div
                  className={`mv-edit-field ${
                    rootTheme === "light" ? "mv-edit-field-light" : ""
                  }`}
                >
                  <div>
                    <span>
                      Personal site or portfolio{" "}
                      {errorStyle === true && validList.site.error === true && (
                        <span className="mv-mint-error-text">
                          Personal site url is required.
                        </span>
                      )}
                    </span>
                    <img src={starIcon} alt="required" />
                  </div>
                  <Input
                    value={user?.link}
                    onChange={(e) => {
                      setFormData({ ...formData, site: e.target.value })
                      setuser({ ...user, link: e.target.value })
                    }}
                    id={
                      errorStyle && validList.site.error === true
                        ? "mv-error-border-red"
                        : ""
                    }
                    placeholder="https//:"
                    suffixIcon={<SelectArrow />}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  />
                </div>
                {/* Email */}
                <div
                  className={`mv-edit-field ${
                    rootTheme === "light" ? "mv-edit-field-light" : ""
                  }`}
                  id={
                    errorStyle && validList.email.error === true
                      ? "mv-error-border-red-div"
                      : ""
                  }
                >
                  <div>
                    <span>
                      Email{" "}
                      {errorStyle === true &&
                        validList.email.error === true && (
                          <span className="mv-mint-error-text">
                            Email is required.
                          </span>
                        )}
                    </span>
                    <img src={starIcon} alt="required" />
                    <span>Your email for marketplace notifications</span>
                  </div>
                  <Input
                    value={user?.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setuser({ ...user, email: e.target.value })
                    }}
                    suffix={
                      <a
                        href="/#"
                        className={`mv-edit-input-suffix ${
                          rootTheme === "light"
                            ? "mv-edit-input-suffix-light"
                            : ""
                        }`}
                      >
                        Confirm
                      </a>
                    }
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              {/* file upload section */}
              <div
                id={
                  errorStyle && validList.file.error === true
                    ? "mv-error-border-red"
                    : ""
                }
              >
                <div>
                  {imageList.length === 0 ? (
                    <svg
                      width="87"
                      height="87"
                      viewBox="0 0 87 87"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M43.5 84C65.8675 84 84 65.8675 84 43.5C84 21.1325 65.8675 3 43.5 3C21.1325 3 3 21.1325 3 43.5C3 65.8675 21.1325 84 43.5 84Z"
                        stroke="#161616"
                        strokeWidth="5"
                        strokeMiterlimit="10"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M70.5 73.2002C70.5 58.2881 58.4121 46.2002 43.5 46.2002C28.5879 46.2002 16.5 58.2881 16.5 73.2002"
                        stroke="#161616"
                        strokeWidth="5"
                        strokeMiterlimit="10"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M43.4998 46.1998C52.4468 46.1998 59.6998 38.9468 59.6998 29.9998C59.6998 21.0528 52.4468 13.7998 43.4998 13.7998C34.5528 13.7998 27.2998 21.0528 27.2998 29.9998C27.2998 38.9468 34.5528 46.1998 43.4998 46.1998Z"
                        stroke="#161616"
                        strokeWidth="5"
                        strokeMiterlimit="10"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <img
                      className="mv-edit-uploaded-image"
                      src={imageList}
                      alt="uploaded"
                    />
                  )}
                </div>
                <div>
                  We recommend an image <br /> of at least 300x300. Gifs work
                  too. <br /> Max 5mb.
                </div>
                <button type="button" onClick={() => uploadRef.click()}>
                  Choose File
                </button>
                <input
                  onChange={upload}
                  type="file"
                  name="filefield"
                  style={{ display: "none" }}
                  ref={(fileInput) => setUploadRef(fileInput)}
                />
                {errorStyle === true && validList.file.error === true && (
                  <div
                    style={{
                      marginTop: "20px",
                      width: "100%",
                      textAlign: "center",
                    }}
                    className="mv-mint-error-text"
                  >
                    You must upload a file.
                  </div>
                )}
              </div>
            </div>
            {/* submit form */}
            <div style={{ width: "100%" }}>
              <Button
                onClick={submitForm}
                className={`mv-edit-submit ${
                  rootTheme === "light" ? "mv-edit-submit-light" : ""
                }`}
              >
                <span>Update profile</span>
              </Button>
            </div>
          </>
        ) : (
          // user not connected view
          <div className="mv-mint-user-not-connected-ui">
            <div>Please connect to the wallet to edit the profile!</div>
            <Button
              onClick={handleSelectedWallet}
              className={`mv-mint-submit-button ${
                rootTheme === "light" ? "mv-mint-submit-button-light" : ""
              }`}
              type="button"
            >
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
      <Snackbar
        text={snackbar.text}
        active={snackbar.isActive}
        color={snackbar.color}
        timeout={snackbar.timeout}
        onClose={() => setSnackbar({ ...snackbar, isActive: false })}
      />
      <Footer />
    </div>
  )
}
export default Body
