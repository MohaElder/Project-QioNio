const parser = require('parser-wxapp');
var html = "<div>Hello World!</div>";
parser(html).then(res => {
  return res;
  console.log(res);
}).catch(err => {
  console.error(err);
})