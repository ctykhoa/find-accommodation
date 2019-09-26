const Crawler = require("crawler")
const cheerio = require('cheerio');
const strictUriEncode = require('strict-uri-encode');
const Boom = require("@hapi/boom")
const CustomError = require("../commons/error")

const c = new Crawler();

async function getDistance(source, dest){
    const src = strictUriEncode(source);
    const des = strictUriEncode(dest);
    var $, dis
    const url = "https://www.google.com/maps/dir/"+ src + "/" + des;
    console.log(url)
    let htmlSrc ;
    const result = await c.queue([{
        uri: url,
        jQuery: false,
        callback: function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                $ = cheerio.load(res.body)
                return $('.section-directions-trip-distance.section-directions-trip-secondary-text div').text()
                
            }
            done();
        }

    }])


    

}

module.exports = {
    getDistance
}