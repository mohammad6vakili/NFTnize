import moneypipe from "moneypipe";

export const stream = (library, network, members, NFTName) => {
    const stream = new moneypipe.stream({
        web3: library,
        network: network
    })
    const title = `Royalities for ${NFTName}`
    let { tx, address } = await stream.create({
        title: title,
        members: members
    })
}

const calculateRoyalities = (totalRoyality) => {}