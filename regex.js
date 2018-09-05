//url validation function
function check(pass){
    console.log('pass erteke'+pass);
    let result = new RegExp("(http|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
    let toBeReturned = result.test(pass);
    console.log('to be returned'+toBeReturned);
    if(toBeReturned){
        let j=0;
        // for(let i=0;i<pass.length;i++){
        //     if(pass[i]=='/') j++;
        // }
        // if(j>2) return false;
        let array = ['.org','.com','.eu','.net','.info','.biz','.mobi','.tv','.co.uk','.us','.me','.at','.hr','.ro','.rs','.sk','.ua','.de','.cc','.hu'];
        j=0;
        array.forEach(function(i){
            if(pass.includes(i)){
                console.log('array '+i);
                j++;
            }
        })
        if(j<1)return false;
        else if (j===1||j==2) return true;
        else if(j>1) return false;
        // else if(!pass.includes('.org')&&!pass.includes('.com')&&!pass.includes('.hu')){
        //     return false;
        // }
        else if (!pass.includes('www.')){
            return false;
        }

        else return true;
    }
    else return false;

}

module.exports = check


