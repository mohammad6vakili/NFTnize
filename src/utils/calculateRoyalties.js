export const calculateRoyalty = (total, royaltywallets) =>
  royaltywallets.map((royaltyWallet) =>
    Object.assign(royaltyWallet, {
      address: royaltyWallet.address,
      role: royaltyWallet.role,
      total: parseInt(total, 10),
      percentage: royaltyWallet.value,
    })
  )
