const router=require("express").Router();
const bcrypt=require("bcrypt")
const User=require("../models/user") //Importing the user from models.

/*router.get("/",(req,res)=>{
    res.send("Hey its user route")
})*/

//1.Update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){   //This is for password
      if(req.body.password){
        try{
            const salt=await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password,salt);
        }catch(err){
            return res.status(500).json(err);
        }
      }
      try{                                                     //This is for user
        const user=await  User.findByIdAndUpdate(req.params.id, {$set:req.body,});
        res.status(200).json("Account as been updated")
      }
      catch(err){
        console.log(err)
        return res.status(500).json(err);
      }
    }else{
        return res.status(403).json("You can update only your account!");
    }
})
//2.Delete user

router.delete("/:id", async(req,res)=>{
  if(req.body.userId===req.params.id || req.body.isAdmin){  
    
    try{                                                     //This is for user
      const user=await  User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account as been deleted")
    }
    catch(err){
      onsole.log(err)
        return res.status(500).json(err);
      }
    }else{
        return res.status(403).json("You can delete only your account!");
    }
})

//3.get a user
router.get("/:id",async(req,res)=>{
  try{
   const user = await User.findById(req.params.id);           //If we need all properties or objects we just use this one.
  const {password,upadateAt, ...others} = user._doc           //we are writing for particular ones which we requires
   res.status(200).json(others)
  }catch(err){
    console.log(err);
    res.status(500).json(err);
  }
});

//4.follow a users
router.put("/:id/follow", async(req,res)=>{
  if(req.body.userId !== req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
       if(!user.followers.includes(req.body.userId)){                  //followers.include means if user already follow this user.
          await user.updateOne({$push: {followers: req.body.userId } });
          await currentUser.updateOne({$push: {followings: req.params.id } });
          res.status(200).json("user has been followed")
       }else{
        res.status(403).json("You already follow this user")
       }

    }catch(err){
      console.log(err)
      res.status(500).json(err);
    }

  }else{
    res.status(403).json("You can follow yourself")
  }
})

//5.unfollow a user
router.put("/:id/unfollow", async(req,res)=>{
  if(req.body.userId !== req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
       if(user.followers.includes(req.body.userId)){
          await user.updateOne({$pull: {followers: req.body.userId } });
          await currentUser.updateOne({$pull: {followings: req.params.id } });
          res.status(200).json("user has been unfollowed")
       }else{
        res.status(403).json("You don't  follow this user");
       }

    }catch(err){
      res.status(500).json(err);
    }

  }else{
    res.status(403).json("You can't unfollow yourself")
  }
  })
module.exports=router