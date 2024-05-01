const getAllProducts = async(req,res)=>{
    res.status(200).json({msg:"Hello World"})
}

const getAllProductsTesting = async(req,res)=>{
    res.status(200).json({msg:"Hello World Testing"})
}

module.exports={getAllProducts, getAllProductsTesting}