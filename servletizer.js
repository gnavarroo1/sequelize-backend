var through     = require('through2'),
fs			= require('fs');
const path 		= require('path');
String.prototype.tokenize = function () {
return this.match(/\S+/g);;
};
function servletizer(rootDirectory, serverjs, targetjs, ignore){
var functionCallbacks="",controllers="",routes="";
var ignoreSet={};
if(Object.prototype.toString.call(ignore) === '[object Array]'){
    for(var i=0;i<ignore.length;++i){
        ignoreSet[ignore[i]]=true;
    }
}
var sortedFuncs=[];
return through.obj(
    function(file, enc, callback){
        if (file.isNull() || file.isDirectory()) {
            this.push(file);
            return callback();
        }
        if (file.isBuffer()) {
            var filePath="./"+
                path.relative(
                    path.resolve(__dirname,rootDirectory),
                    path.resolve(file.path))
                .replace(/\\/g,'/');
            if(ignoreSet[filePath]||path.extname(filePath)!=".js"){
                console.log("ignoring:"+filePath);
                this.push(file);
                return callback();
            }
            if(file.path==path.resolve(__dirname,serverjs)){
                console.log("ignoring server js: "+serverjs);
                return callback();
            }
            console.log("processing:"+filePath);
            var fileString = file.contents.toString();
            var fileLines = fileString.split('\n');
            var servletAnnotation="//@servlet";
            var controllerAnnotation="//@controller";
            var controllerName="default_controller";
            var isController=false;
            for(var nl=0;nl<fileLines.length;++nl){
                if(fileLines[nl].trim().startsWith("//@") ==false) continue;
                var line=fileLines[nl].tokenize();
                if(line[0]==controllerAnnotation){
                    isController=true;
                    controllerName=line[1];
                    sortedFuncs.push("@controller "+controllerName);
                    if(controllerName==undefined||controllerName==":filename:")
                        controllerName=path.basename(filePath,'.js');
                    var params="";
                    for(var i=2;i<line.length;++i){
                        if(i>2) params+=",";
                        params+=line[i];
                    }
                    var controller=
                        "var "+controllerName+"    = require('"+filePath+"')("+params+")\n";
                    controllers+=controller;
                }
                else if(line[0]==servletAnnotation){
                    var method = line[1];
                    var ptr=nl+1;
                    var functionCallback = undefined;
                    var validated=false;
                    while(true){
                        var tokens=fileLines[ptr].tokenize();
                        if(tokens&&tokens.length)
                            {
                                if(tokens[0].startsWith("//@")==false) break;
                                if(tokens[0]=="//@auth"){
                                    validated=true;
                                }
                            }
                        
                        ptr++;
                    }
                    var functionName=fileLines[ptr].tokenize()[0];
                    functionName=functionName.substr(functionName.indexOf('.')+1);
                    sortedFuncs.push(functionName);
                    var servletPath=line[2] || "/api/"+functionName;
                    var functionCallback;
                    functionCallback=validated?
                    "var "+functionName+" = function(req, res) {"+
                    "	"+controllerName+".ValidarLocalEjecutar(req, res,"+
                    controllerName+"."+functionName+");\n"+
                    "}\n"
                    :
                    "var "+functionName+" = function(req, res) {\n"+
                    "	"+controllerName+"."+functionName+"(req, res);\n"+
                    "}\n";
                    var route=
                    "app."+method+"('"+servletPath+"'"+","+functionName+");\n"
                    functionCallbacks+=functionCallback;
                    routes+=route;
                }
            }
            if(isController)
                sortedFuncs.push("");
            this.push(file);
            return callback();
        }
    },function(callback){
        var logfile="";
        for(var i=0;i<sortedFuncs.length;++i)
            logfile+=sortedFuncs[i]+"\n";
        fs.writeFileSync("services.txt", logfile);
        var finalSource="";
        var server=fs.readFileSync(serverjs, 'utf8').split('\n');
        for(var i=0;i<server.length;++i){
            var line=server[i] + "\n";
            var tline=line.trim();
            if(tline.startsWith("//@") == false){
                finalSource+=line;
            }
            else if(tline=="//@routes"){
                finalSource+=routes;
            }
            else if(tline=="//@functionCallbacks"){
                finalSource+=functionCallbacks;
            }
            else if(tline=="//@controllers"){
                finalSource+=controllers;
            }
        }
        fs.writeFileSync(targetjs, finalSource);
        callback();
    }
);
}

module.exports = servletizer;