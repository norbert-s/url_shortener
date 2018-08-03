const randGen =()=>{
    let rand = Math.floor((Math.random()*10000)+10);
    console.log(rand);
    return rand;
}

module.exports = randGen;