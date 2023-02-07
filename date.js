

//Ako koristim samo 1 funkciju dovoljno je:
// exports = getDate;
//U ejs fajlu pristupam preko date()



// AKo imam vise funkcija
// U ejs fajlu pristupam preko date.getDate()

const date = new Date();

exports.getDate = function(){
    return date.toLocaleDateString("en-US");
}

exports.getFullDate = function(){
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    return date.toLocaleDateString("en-US", options);
};

