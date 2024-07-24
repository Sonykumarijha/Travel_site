// function getRandomSixDigit() {
//     return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
//   }

export const  getRandomSixDigit  = (req,res) => {
      return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

}

//let randomSixDigit = getRandomSixDigit();
  //console.log(randomSixDigit);
