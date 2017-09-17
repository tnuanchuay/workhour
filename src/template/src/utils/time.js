module.exports = {
    getFirstDateOfTheWeek : () => {
        let curr = new Date()
        curr.setUTCHours(0, 0, 0, 0)
        let first = curr.getDate() - curr.getDay()
        return new Date(curr.setDate(first))
    }
}