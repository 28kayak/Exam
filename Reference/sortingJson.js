var arr = [
    {
        "name": "John",
        "age": "16"
    },
    {
        "name": "Charles",
        "age": "26"
    },
    {
        "name": "Kaya",
        "age": "23"
    }
];
function sortBy(propaty){
    return function(a,b){
        if( a[propaty] > b[propaty]){
            return 1;
        }else if( a[propaty] < b[propaty] ){
            return -1;
        }
        return 0;
    }
}
//Usage
arr.sort( sortBy("age") );
console.log(arr);
arr.sort( sortBy("name") );
console.log(arr);