const a = { skip: 0,
    limit: 20,
    txid:
     '0x94e946919d943a73cf2a63615061fc47afabc04286dcb1ecd3d01a5495290c95' }

// delete a.limit
// delete a.skip

const tem = Object.assign({}, a)


console.log('tem',tem)
delete tem.limit
delete tem.skip

console.log('a',a)
console.log('tem',tem)