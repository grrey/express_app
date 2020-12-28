var  bodybuilder = require('bodybuilder');

 
var a = bodybuilder()
// .query('terms', 'user', ['kimchy', 'elastic'])
// .query('must_not' , 'BBSK' , false )


.query('nested', { path: 'obj1', score_mode: 'avg' }, (q) => {
	console.log( q )
    return q
      .query('match', 'obj1.name', 'blue')
      .query('range', 'obj1.count', {gt: 5})
  })
.build();

console.log(  JSON.stringify(a)   )