const { QueryEngine } = require("@comunica/query-sparql");

async function query() {
    const myEngine = new QueryEngine()
    const q =  `prefix schema: <http://schema.org/> 
    PREFIX props: <https://w3id.org/props#>
    Select * where {
        <https://www.ugent.be/myAwesomeFirstBIMProject#window_12f20764-a953-4ad0-967b-a3874d44e0fb> props:objectTypeIfcObject ?i .
        ?i schema:value ?material .

      }`
    const sources = ["http://localhost:5000/Louis-De-Vos/lbd/voorpost/local/datasets/48342ae2-2f35-4d91-915b-bc964fea6e0d/a624aa3d-436c-48c3-a111-56bce3fc766c"]
    
        const results = await myEngine.queryBindings(q, {sources})
        .then(i => i.toArray())
        .then(i => i.map(item =>item.get('material').value))
    console.log('results', results)
}

query()