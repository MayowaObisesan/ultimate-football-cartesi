export const calculateRepost = (value: number) => {
    return value / 1000;
}

export const shortenAddress = (addr: string) => {
    return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
};


export const eightRandomNumber = () => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    // console.log(`Random 8-digit number: ${randomNumber}`);
    return randomNumber;
};


export const shortenPlayerNames = (name: string) => {
    if (!name || name.length === 0) return ""
    const nameSplit = name.split(" ")
    const lastName = nameSplit[nameSplit.length - 1]
    const firstName = nameSplit[0]
    return `${firstName[0]}. ${lastName}`
}