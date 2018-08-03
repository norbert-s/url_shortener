//url validation function
function check(pass){
    let result = new RegExp("(http|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
    return result.test(pass);
}

module.exports = check