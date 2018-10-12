var fs = require('fs');
const SVGO = require('./node_modules/svgo');
var fullNames = require('./English_sorted');
var svgo = new SVGO({
  plugins: [{
    cleanupAttrs: true,
  }, {
    removeDoctype: true,
  },{
    removeXMLProcInst: true,
  },{
    removeComments: true,
  },{
    removeMetadata: true,
  },{
    removeTitle: true,
  },{
    removeDesc: true,
  },{
    removeUselessDefs: true,
  },{
    removeEditorsNSData: true,
  },{
    removeEmptyAttrs: true,
  },{
    removeHiddenElems: true,
  },{
    removeEmptyText: true,
  },{
    removeEmptyContainers: true,
  },{
    removeViewBox: false,
  },{
    cleanupEnableBackground: true,
  },{
    convertStyleToAttrs: true,
  },{
    convertPathData: true,
  },{
    convertTransform: true,
  },{
    removeUnknownsAndDefaults: true,
  },{
    removeNonInheritableGroupAttrs: true,
  },{
    removeUnusedNS: true,
  },{
    cleanupIDs: true,
  },{
    cleanupNumericValues: true,
  },{
    moveElemsAttrsToGroup: true,
  },{
    moveGroupAttrsToElems: true,
  },{
    collapseGroups: true,
  },{
    removeRasterImages: false,
  },{
    mergePaths: true,
  },{
    convertShapeToPath: true,
  },{
    sortAttrs: true,
  },{
    removeDimensions: true,
  }]
});

// var readline = require('readline'),

// rl = readline.createInterface({
// 	input: fs.createReadStream("input.txt"), 
// 	output: fs.createWriteStream("output.txt")
// });

// rl.on('line', function(line) {
//   console.log(line);
//   var data = line;
//   var dataArr = data.split(' ');
//   var firstNum = Number(dataArr[0]);
//   var secondNum = Number(dataArr[1]);
// 	//console.log(firstNum);
// 	//console.log(secondNum);
//   rl.write("запись", function(error){
//     console.log("конец работы программы");
//     //if(error) throw error; // если возникла ошибка);
//   });
// }).on('close', function() {
// 	console.log("конец работы программы");
//   rl.close();
//   process.exit(0);
// });

// var fs = require("fs");
 
// fs.writeFileSync("output.txt", "Hello мир!")
// console.log("Cинхронная запись файла завершена. Содержимое файла:");
// var data = fs.readFileSync("./svg/abh.svg", {"encoding": "utf8", "flag":"r"});
// console.log(data);  // выводим считанные данные

var symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;
var pathIn = "../svg";
var pathOut = "./svg-out"
var bigResult = [];
fs.readdir(pathIn, function(err, items) {
  //console.log(items);
  // fullNames.forEach(element  => {
  //   let fullName = element.alias.toLowerCase();
  //   items.forEach(shortName => {
  //     //console.log(shortName);
  //     //console.log(fullName);
  //     if (fullName[0] === shortName[0] && fullName[1] === shortName[1] && fullName[2] === shortName[2]) {
  //       console.log(shortName + ' ' + fullName);
  //     }
  //   })
  // });
  let tableData = JSON.parse(fs.readFileSync('./bigData.json', {"encoding": "utf8", "flag":"r"}));
  let promise = new Promise((resolve, reject) => {
  for (let i=1; i<items.length; i++) {
    if (items[i].length == 7) {
    let data = fs.readFileSync(pathIn + '/' + items[i], {"encoding": "utf8", "flag":"r"});
    let item = items[i];
    svgo.optimize(data)
      .then(function(result) {
        result = encodeSVG(result.data)
        //console.log(result);  // выводим считанные данные
        //console.log(item);

        let curName = fullNames.find(element => {
          let fullName = element.alias.toLowerCase();
          //if (fullName[0] === item[0] && fullName[1] === item[1] && fullName[2] === item[2]) {
          if (fullName.indexOf(item.substring(0,3)) !== -1) {
            //console.log(fullName + ' ' + item);
            return true;
          }
        });
        let engName, rusName;
        //if (!curName) { 
          console.log(item);
          if (tableData.find(element => element.shortName == item.substring(0,3))) {
          engName = tableData.find(element => element.shortName == item.substring(0,3)).fullName.toLowerCase();
          rusName = tableData.find(element => element.shortName == item.substring(0,3)).rusName;
          bigResult.push({
            "shortName" : item.substring(0,3),
            "rusName" : tableData.find(element => element.shortName == item.substring(0,3)).rusName,
            "fullName" : engName,
        });
      }
        // } else  {
          // engName = curName.alias.toLowerCase();
          // rusName = curName.name;
          // bigResult.push({
          //     "rusName" : curName.name,
          //     "fullName" : curName.alias.toLowerCase(),
          //     "shortName" : item.substring(0,3)
          // });
        //}
        let writeString = `  &--${engName} /* ${rusName} */\n    background-image url("data:image/svg+xml,${result}")\n`;
        if (i !== 1) fs.writeFileSync("output.txt", writeString, {"flag" : "a"});
        else fs.writeFileSync("output.txt", writeString, {"flag" : "w"});
      })
      // .then(() => {
      //   fs.writeFileSync("bigData.json", JSON.stringify(bigResult), {"flag" : "a"});
      //   //console.dir(bigResult);
      // }) 
  }}
  resolve("result");
})
// promise.then(() => {
//     fs.writeFileSync("bigData.json", JSON.stringify(bigResult), {"flag" : "a"});
//     //console.dir(bigResult);
//   }) 
});

function encodeSVG( data ) {
  // Use single quotes instead of double to avoid encoding.
  data = data.replace( /"/g, '\'' );

  data = data.replace( />\s{1,}</g, "><" );
  data = data.replace( /\s{2,}/g, " " );
  //data = data.replace(  "xmlns:xlink='http://www.w3.org/1999/xlink' ", '' );

  return data.replace( symbols, encodeURIComponent );
}