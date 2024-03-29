const router=require("express").Router();
const Post=require("../models/Post");
const User=require("../models/user")

/*router.get("/",(req,res)=>{
    console.log("post page")
})*/

//create a post
router.post("/",async(req,res)=>{
    const newPost=new Post(req.body)
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
})

//update a post
router.put("/:id", async(req,res)=>{
    try{
    const post= await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({$set:req.body});
        res.status(200).json("The post has been updated")

    }else{
        res.status(403).json("You can update only your post")
    }
}catch(err){
    console.log(err)
    res.status(500).json(err);
}
});

//delete a post
router.delete("/:id", async(req,res)=>{
    try{
    const post= await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.deleteOne();
        res.status(200).json("The post has been deleted")

    }else{
        res.status(403).json("You can deleted only your post")
    }
}catch(err){
    console.log(err)
    res.status(500).json(err);
}
});

//like/dislike a post

router.put("/:id/like", async(req,res) =>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("The post has been liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(403).json("The post has been disliked");
        }
    }catch(err){
        console.log(err)
        res.status(500).json(err);
    }

});

//get a post

router.get("/:id", async(req,res) =>{
    try{
        const post =  await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err)
    }
});

//get timeline posts

router.get("/timeline/all", async(req,res) =>{
    
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id}); //This line is for getting the above user details.
        const friendPosts = await Promise.all(                       //Here I used the map i.e., is loop.When we usde loops 
        currentUser.followings.map(friendId=>{                       // Then we need to use promises.
          return Post.find({userId:friendId});
            })
        );
        res.json(userPosts.concat(...friendPosts))
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

module.exports = router;