

var hisData = require('../../../data/his600519'); 

function markZheDian(arr, anaSize = [6, 7, 8, 9, 10, 11, 12 ]) {
// function markZheDian(arr, anaSize = [13]) {


  // { val: X , directX: true/false : true上趋,  false 下趋 }
  function markI(d, i, day) {
      d.tuci = d.tuci || {};
      var val = 0 , bvt = 0 , avt = 0 ; 
      for (let j = 1; j <= day; ++j) {
          let bf = arr[i - j];
          let af = arr[i + j];

          // console.log( 111, ( bf?(  bf.close - d.close  ): 0 )   );
          let bv = bf ? (bf.close - d.close) : 0 ;
          let av = af ? (af.close - d.close) : 0 ;

          bvt += bv ;
          avt += av ;
          val += Math.abs( bv + av );
      }

      // d.tuci[day] = { val: +val.toFixed(2) , directA:  avt > 0 ,  directB: bvt < 0  } ;
      d.tuci[day] = { val: +val.toFixed(2) } ;
 
  }

  function pickUpTuciDate(hisArr, day) {
      // 找出折点; 
      var dateArr = [];
      hisArr.forEach((a, i) => {
          let hit = true;
          let val = a.tuci[day].val ;
          if(!val){
            // return ;
          }
          for (let j = 1; j < day; ++j) {

              let bf = hisArr[i - j];
              if (bf) {
                  hit = hit && (bf.tuci[day].val < val);
              }

              let af = hisArr[i + j];
              if (af) {
                  hit = hit && (af.tuci[day].val < val);
              }
          }
          if (hit) { 
              let  f = {  
                date: a.date,
                close: a.close,
              }; 
              dateArr.push( f );

          }
      });
      // 最后一天;
      let lastDay = hisArr[ hisArr.length -1 ]; 
      dateArr.push({
        date: lastDay.date ,
        close : lastDay.close 
      })

     
      dateArr.forEach( (v,i) => {
        let af =  dateArr[  i + 1 ];
        if(af){
          v.direct =  af.close > v.close ;
        }
      });
      let dateArr2 = [] ; 
      dateArr.forEach((v,i) => {
        let bf = dateArr2[ dateArr2.length -1 ]; 

        if( i == 0 ){
          dateArr2.push( v );
        }
        if( bf ){
          if( bf.direct ^ v.direct ){  
            dateArr2.push( v );
          }else {
            i != 0 && dateArr2.pop();
            dateArr2.push( v );
          }   
        }
      })




      // console.log( 'date 2 = ' ,dateArr2.map((x) => {
      //   return x.date
      // }).join(',')  )

      return { [day]: dateArr   ,  [day+'X']: dateArr2 };

 
  }

  var newArr = arr.map((d, i) => {
      anaSize.forEach((day) => {
          markI(d, i, day)
      })
      return d;
  });

  var result = {};
  anaSize.map((day) => {
      let dateResult = pickUpTuciDate(newArr, day);  
 
      Object.assign( result , dateResult )  
  })
  return result;
}

module.exports = markZheDian ;

// var s = markZheDian(hisData)
// console.log(s)


