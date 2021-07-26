const express = require("express");
const app = express();
app.use(
    express.urlencoded({
      extended: true
    })
  );
app.use(express.json())
const cors = require('cors');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');


app.use(cors());
app.set('view engine', 'ejs');
app.listen(3000, () => {
  console.log("Application started");
});

app.get("/", (req, res) => {
    localStorage.setItem('abasdas','asdasd');
    let cfgOutput = JSON.parse(localStorage.getItem('cfgData'));
   
      cfgOutput = cfgOutput.stderr.map(line => line.text.trim());
      let cfgNodes = cfgOutput.filter(line => line.startsWith('['));
      cfgNodes = cfgNodes.map((line, i) => {let len = line.length; let suffix = i + '' == 0 ? ' Entry' : i + '' == len-1 ? ' Exit' : ''; let label = 'B' + i; return {id: line.substr(1,len-2), label: line.substr(1,len-2), shape: 'circle' }});
      let cfgEdges = [];   
      let edges = cfgOutput.filter(line => line.startsWith('Succs'));
      edges = edges.map(line => { let len = line.length; return line.substr(11,len) });
      edges.forEach((edge, i) => {
          let newEdges = edge.split(" ");
          newEdges.forEach(newEdge => {
              cfgEdges.push({
                  from: cfgNodes[i].id + '',
                  to: newEdge + ''
              })
          })
      })
      cfgEdges.push({
          from: "B1",
          to: "B0 (EXIT)"
      });
    res.render('index', { nodes: cfgNodes, edges: cfgEdges });
});


app.post("/", (req, res) => {
    localStorage.setItem('cfgData',JSON.stringify(req.body.cfgData));
    var response = {  
        status:"success"
    };
    res.end(JSON.stringify(response)); 
});