import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import sizeof from 'object-sizeof';
const fs = require('fs');
// import mongoose
// import env

// connect to mongodb

var object = {
    aProperty: {
        aSetting1: 1,
        aSetting2: 2,
        aSetting3: 3,
        aSetting4: 4,
        aSetting5: 5
    },
    bProperty: {
        bSetting1: {
            bPropertySubSetting: true
        },
        bSetting2: "bString"
    },
    cProperty: {
        cSetting: "cString"
    }
}

function analyzeCollection(){
    var statsTree = {name:"root"};
    analyzeObj(statsTree, object);
    analyzeObj(statsTree, object);
    analyzeObj(statsTree, object);
    analyzeObj(statsTree, object);
    analyzeObj(statsTree, object);
    analyzeObj(statsTree, object);
    analyzeObj(statsTree, object);
    analyzeObj(statsTree, object);
    
    // write flare-2
    let jsonString = JSON.stringify(statsTree,null,2);
    console.log(jsonString)    
    fs.writeFileSync('flare-2.json', jsonString); 
    
}

function analyzeObj(statsTree, object){    
    console.log("Analyzing object...");
    recurseObj(statsTree, object, '')
}

function recurseObj(statsNode, obj, stack) {
    if (!statsNode.hasOwnProperty('children')) {
        statsNode.children = [];
    }

    for (var property in obj) { 
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == "object") {
                // Objects
                var newStatsNode = statsNode.children.find(n => n.name == property);
                if(newStatsNode==null){
                    newStatsNode = {name:property, children:[]}
                    statsNode.children.push(newStatsNode);
                }
                //console.log('O: ' + property);
                recurseObj(newStatsNode.children, obj[property], stack + '.' + property);
            } else {
                // Attributes
                var newStatsNode = statsNode.find(n => n.name == property);
                let size = sizeof(property) + sizeof(obj[property]) + 2;
                //console.log(property + "   " + obj[property] + "   " + size);
                
                if(newStatsNode==null){
                    newStatsNode = {name:property, value:size}
                    statsNode.push(newStatsNode);
                } else {
                    newStatsNode.value+=size;
                }
            }
        }
    }
}

analyzeCollection();