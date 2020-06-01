module.exports = {
    logtime : () => {
        let d = new Date()
        let ms = d.getMilliseconds().toString()
        while(ms.length < 3) ms = "0" + ms
        return d.toLocaleTimeString() + ":" + ms
    }
}