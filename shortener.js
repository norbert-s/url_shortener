//shortener function
 function short() {
    // set url length limit
    let random = Math.floor(Math.random()*10000);

    return random;
};

module.exports = short;