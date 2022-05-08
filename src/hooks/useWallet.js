import { useContext } from "react"
import { WalletConnectionContext } from "../contexts/walletContext"

// ----------------------------------------------------------------------

const useWallet = () => useContext(WalletConnectionContext)

export default useWallet
