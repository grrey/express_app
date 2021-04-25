
  

module.exports = function (inp, callback) {

  console.log( process.execArgv  ,   process.env.p_id  )

  callback(null, inp + ' BAR (' + process.pid + ')')

  
}

process.on('message' , ({p_id}) => {   
  p_id && ( process.env.p_id = p_id )
})