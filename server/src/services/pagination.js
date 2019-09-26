async function paginate(Model, query, perPage, page, sortOption) {
    try {
        let sortQuery = {
            createdAt: -1
        };
        if(!page || page < 0){
            page = 1;
        }
        if(!perPage){
            perPage = 5;
        }
        if (sortOption) {
            sortQuery = sortOption;
        }
        
        let result = {};
        const matched = await Model.find(query);
        result.total = matched.length;
        result.page = Number(page);
        result.pages = Math.ceil(result.total/perPage);
        result.limit = perPage;
        //neu page > total page thi page = last page
        if(result.page > Math.ceil(result.total/perPage)){
            result.page = Math.ceil(result.total/perPage);
        } 
        if(result.total > 0){
            result.docs = await Model.find(query).skip(perPage * (result.page - 1)).limit(perPage).sort(sortQuery);        
        }
        else{
            result.docs=[];
        }
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = {
    paginate
}
/* https://medium.com/hexient-labs/pagination-with-mongoose-b00c5207371e */