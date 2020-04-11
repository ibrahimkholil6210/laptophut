const fs = require('fs');
const http = require('http');
const url = require('url');

const dataJson = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');
const jsonDist = JSON.parse(dataJson);

const server = http.createServer((req,res) => {
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url,true).query.id;
    
    if(pathName === '/product' || pathName === '/'){    
        res.writeHead(200,{'Content-type' : 'text/html'});
        fs.readFile(`${__dirname}/templates/overview-tem.html`,'utf-8',(err,overviewHtml) => {
            fs.readFile(`${__dirname}/templates/card-tem.html`,'utf-8',(err,data) => {
                let genarateHTML = jsonDist.map(laptop => {
                    return templating(data,laptop);
                }).join(' ');
                const output = overviewHtml.replace(/{%cards%}/g,genarateHTML);
                res.end(output);
            })
        });
    }else if(pathName === '/laptop' && id < jsonDist.length){
        res.writeHead(200,{'Content-type' : 'text/html'});

        fs.readFile(`${__dirname}/templates/laptop-tem.html`,'utf-8',(err,data) => {
            const laptop = jsonDist[id];
            const output = templating(data,laptop);
            res.end(output);
        });

    }else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
        fs.readFile(`${__dirname}/data/img/${pathName}`,(err,data) => {
            res.writeHead(200,{'Content-type' : 'image/jpg'});
            res.end(data);
        })
    }else{
        res.writeHead(404,{'Content-type' : 'text/html'});
        res.end("404 unable to handle the request!");
    }
});

server.listen(1337,'127.0.0.1',() => {
    console.log("Lesting to 1337 port");
});


function templating(htmlData,laptop){
    let output = htmlData.replace(/{%price%}/g,laptop.price);
    output = output.replace(/{%productname%}/g,laptop.productName);
    output = output.replace(/{%screen%}/g,laptop.screen);
    output = output.replace(/{%ram%}/g,laptop.ram);
    output = output.replace(/{%cpu%}/g,laptop.cpu);
    output = output.replace(/{%storage%}/g,laptop.storage);
    output = output.replace(/{%description%}/g,laptop.description);
    output = output.replace(/{%id%}/g,laptop.id);
    output = output.replace(/{%image%}/g,laptop.image);
    return output;
}