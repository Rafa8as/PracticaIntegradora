import { Router } from "express";
import cookieParser from "cookie-parser";

const cookies = Router ();
cookies.use(cookieParser("<COOKIESECRET>"));

cookies.get("/set", (req, res)=>{
    try {
        res.cookie("New cookie", "Esta es una cookie",{
            masAge: 5000,
            signed:true,
        });
        return res.status(200).send(`Cookie establecida`);
    } catch (err){
        return res.status(500).json({error: err.message});
    };
});


cookies.get ("/get", (req,res)=>{
    try{
        return res.status(200).send(req.signedCookies);
    }catch (err){
        return res.status(500).json({error: err.message});
    }
});

cookies.get("/delete", (req, res) => {
	try {
		res.clearCookie("New cookie");
		return res.status(200).send(`Cookie removed`);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

export default cookies;