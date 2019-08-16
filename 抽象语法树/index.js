let fs  = require('fs');
const esprima = require('esprima');//将JS代码转化为语法树模块
const estraverse = require('estraverse');//JS语法树遍历各节点
const escodegen = require('escodegen');//将JS语法树反编译成js代码模块


function  getAst(jsFile) {
  
    let jsCode;
    return new Promise((resolve)=>{
        fs.readFile(jsFile, (error, data) => {
            jsCode = data.toString();
            resolve(esprima.parseScript(jsCode));
        });
    });
}

/**
 * 设置全等
 */
function toEqual(node) {
    if (node.operator === '==') {
        node.operator = '===';
    }
}
/**
 * 把parseint改为标准方法
 * @param {节点} node 
 */
function setParseint(node) {
    if (node.type === 'CallExpression' && node.callee.name === 'parseInt' && node.arguments.length===1){
        node.arguments.push({
            "type": "Literal",
            "value": 10,
            "raw": "10"
        });
    }
}

/**
 * 删除console
 */
function delConsole(node) {
    if (node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && node.expression.callee.object.name==='console') {
        node.expression.callee.object.name = '//console';
    }
}

/**
 * 把var变成let
 */
function setLet(node){
    if(node.kind === 'var'){    
        node.kind = 'let';
    }
}

/**
 * 
 * @param {遍历语法树} ast 
 */
function walkIn(ast){
    estraverse.traverse(ast, {
        enter: (node) => {
            toEqual(node);
            setLet(node);
            delConsole(node);
            setParseint(node);
        }
    });
}



function  writeCode(file,data) {
    fs.writeFile(file,data,(error)=>{
        console.log(error);
    });
}

function Main(){
    let file = './jsCode.js';
    let distFile = './dist.js';
    getAst(file).then(function(jsCode) {
        walkIn(jsCode);
        
        //删掉 console ， 通过parseScript在生成一变ast去掉注释的内容
        // let distCode = escodegen.generate( esprima.parseScript( escodegen.generate(jsCode)));
        //注释 console
        let distCode = escodegen.generate(jsCode);
        console.log('distcode',distCode);

        writeCode(distFile,distCode);
    });
}


Main();