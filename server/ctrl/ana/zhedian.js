

var hisData = require('../../../data/his600519'); 

function markZheDian(arr, anaSize = [6, 7, 8, 9, 10, 11, 12]) {

  function markI(d, i, day) {
      d.tuci = d.tuci || {};
      var val = 0;
      for (let j = 1; j <= day; ++j) {
          let bf = arr[i - j];
          let af = arr[i + j];

          // console.log( 111, ( bf?(  bf.close - d.close  ): 0 )   )

          val += Math.abs((bf ? (bf.close - d.close) : 0) + (af ? (af.close - d.close) : 0));
      }
      d.tuci[day] = +val.toFixed(2);
  }

  function pickUpTuciDate(hisArr, day) {
      // 找出折点; 
      var dateArr = [];
      hisArr.forEach((a, i) => {
          let hit = true;
          let val = a.tuci[day];
          for (let j = 1; j < day; ++j) {

              let bf = hisArr[i - j];
              if (bf) {
                  hit = hit && (bf.tuci[day] < val);
              }

              let af = hisArr[i + j];
              if (af) {
                  hit = hit && (af.tuci[day] < val)
              }

          }
          if (hit) {
              dateArr.push({
                  date: a.date,
                  close: a.close
              })
          }
      })
      return dateArr;
  }

  var newArr = arr.map((d, i) => {
      anaSize.forEach((day) => {
          markI(d, i, day)
      })
      return d;
  });

  var result = {};
  anaSize.map((day) => {
      let dateArr = pickUpTuciDate(newArr, day); 
        result[day] = dateArr;
  })
  return result;
}

module.exports = markZheDian ;

// var s = markZheDian(hisData)
// console.log(s)