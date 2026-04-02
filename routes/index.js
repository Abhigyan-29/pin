var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require('passport-local')
const upload = require('./multer');
const https = require('https');
const http = require('http');
const path = require('path');

passport.use(new localStrategy(userModel.authenticate()))
/* GET splash/home page. */
router.get('/', async function(req, res, next) {
  let user = null;
  if (req.isAuthenticated()) {
    user = await userModel.findOne({ username: req.session.passport.user });
  }
  // Grab random posts for the background collage
  const totalPosts = await postModel.countDocuments();
  const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, totalPosts - 12)));
  const randomPosts = await postModel.find().skip(skip).limit(12);
  res.render('index', { nav: false, user, randomPosts });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/profile');
  res.render('login', { nav: false, user: null });
});

router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req, res, next) {
 const user =  await userModel.findOne({username : req.session.passport.user})
 user.profileImage = req.file.filename;
 await user.save();
 res.redirect("/profile")
});




router.get('/register', function(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/profile');
  res.render("register", { nav: false, user: null })
});

router.get('/show/posts', isLoggedIn,async function(req, res, next) {
  const user =  
  await userModel
     .findOne({username : req.session.passport.user})
     .populate("posts")
     
  res.render("show",{user, nav:true})
});

router.get('/profile', isLoggedIn,async function(req, res, next) {
  const user =  
  await userModel
     .findOne({username : req.session.passport.user})
     .populate("posts")
     
  res.render("profile",{user, nav:true})
});

router.get('/feed', async function(req, res, next) {
  // Check if someone is logged in
  let user = null;
  if(req.isAuthenticated()) {
    user = await userModel.findOne({username : req.session.passport.user})
  }

  const query = req.query.q || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  // Dynamic Content Generation for Searches
  if (query) {
    const count = await postModel.countDocuments({ title: { $regex: query, $options: 'i' } });
    if (count < 10) {
      let dummyUser = await userModel.findOne({ username: 'system_bot' });
      if (dummyUser) {
        const fakePosts = [];
        const heights = [400,500,600,450,550,700,480,520,580,620,420,540,660,490,510,630,470,560];
        for (let i = 0; i < 18; i++) {
          const seed = `${query.replace(/\s+/g, '-').toLowerCase()}-${i}`;
          fakePosts.push({
            user: dummyUser._id,
            title: query.charAt(0).toUpperCase() + query.slice(1),
            description: `A curated photo for the "${query}" category.`,
            image: `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/${heights[i]}`
          });
        }
        const inserted = await postModel.insertMany(fakePosts);
        dummyUser.posts.push(...inserted.map(p => p._id));
        await dummyUser.save();
      }
    }
  }

  let posts;
  if (query) {
    posts = await postModel.find({
      title: { $regex: query, $options: 'i' }
    }).populate("user").skip(skip).limit(limit).sort({_id: -1});
  } else {
    // Use aggregate to get truly random posts (shuffles on each page load)
    posts = await postModel.aggregate([
      { $sample: { size: limit } }
    ]);
    // Populate the user field manually since aggregate doesn't support .populate()
    posts = await postModel.populate(posts, { path: 'user' });
  }

  // If this is an infinite scroll request, just send back the HTML snippet
  if (req.query.ajax === 'true') {
    return res.render("partials/feed_items", { user, posts });
  }

  res.render("feed",{ user, posts, nav: true, query })
});

router.get('/add', isLoggedIn,async function(req, res, next) {
  const user =  await userModel.findOne({username : req.session.passport.user})
  res.render("add",{user, nav:true})
});

router.post('/createpost', isLoggedIn, upload.single("postimage"), async function(req, res, next) {
  const user =  await userModel.findOne({username : req.session.passport.user})
  const post = await postModel.create({
    user : user._id,title : req.body.title,
    description : req.body.description,
    image:req.file.filename
  });
user.posts.push(post._id);
await user.save();
res.redirect("/profile");


});

router.post('/register', function(req, res, next) {
  const data = new userModel({
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact,
    name:req.body.fullname
  })
  userModel.register(data,req.body.password)
  .then(function(){
passport.authenticate("local")(req,res,function(){
  res.redirect('/profile')
})
  })
});


router.post('/login',passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect:"/"
}), function(req, res, next) { 
});

router.get('/pin/:postid', async function(req, res, next) {
  let user = null;
  if(req.isAuthenticated()) {
    user = await userModel.findOne({username : req.session.passport.user});
  }
  const post = await postModel.findById(req.params.postid).populate("user");
  if (!post) return res.redirect('/feed');
  
  res.render("pin", { user, post, nav: false });
});

router.get('/download/:postid', async function(req, res, next) {
  try {
    const post = await postModel.findById(req.params.postid);
    if (!post) return res.status(404).send("Post not found");

    const imgUrl = post.image;
    // Set a dynamic filename
    const filename = `PinNova_${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'artifact'}.jpg`;
    
    // Remote image handling via proxy (with redirect following)
    if (imgUrl.startsWith('http')) {
      const { Readable } = require('stream');
      const fetchResponse = await fetch(imgUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      
      if (!fetchResponse.ok) {
        console.error("Fetch failed with status:", fetchResponse.status, fetchResponse.statusText);
        return res.status(404).send('External image failed to load');
      }
      
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', fetchResponse.headers.get('content-type') || 'image/jpeg');
      
      Readable.fromWeb(fetchResponse.body).pipe(res);
    } 
    // Local image handling
    else {
      const filePath = path.join(__dirname, '../public/images/uploads/', imgUrl);
      res.download(filePath, filename);
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.get('/save/:postid', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const postid = req.params.postid;
  
  if (user.saved.indexOf(postid) === -1) {
    user.saved.push(postid);
  } else {
    user.saved.splice(user.saved.indexOf(postid), 1);
  }
  await user.save();
  res.redirect("/feed");
});

router.get('/delete/:postid', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const postid = req.params.postid;
  
  // Find the post
  const post = await postModel.findById(postid);
  // Ensure the user deleting is the author
  if (post && post.user.toString() === user._id.toString()) {
    await postModel.findByIdAndDelete(postid);
    // Remove from user's posts
    user.posts.pull(postid);
    await user.save();
  }
  res.redirect("/show/posts");
});


router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err){
      return next(err);}
      res.redirect('/')
    });
  });


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/")
}




module.exports = router;
