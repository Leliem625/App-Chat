import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/session.js';
 const ACCESS_TOKEN_TTL = "15m"; // thuờng là dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày
class authController{
   
    async signUp(req, res){
        try{
              const {  username , password, email, firstname, lastname } = req.body;
                if(!username || !password || !email || !firstname || !lastname){
                    return res.status(400).json({message:'All fields are required'});
                }
                const findUser = await User.findOne({username});
                if(findUser){
                    return res.status(409).json({message:'Người dùng đã tồn tại!'});
                }

                const hashPassword = await bcrypt.hash(password,10);

                await User.create({
                    username,
                    hashedPassword:hashPassword,
                    email,
                    displayName: `${lastname} ${firstname}`,
                });
                return res.status(204).json({message:'User created successfully'}); 
        }
        catch(error){
            console.error(error);
            return res.status(500).json({message:'Something went wrong'});
        }
    }
    async signIn(req, res){
        try{
            const { email, password} = req.body;
            if( !email || !password){
                return res.status(400).json({message:'All fields are required'});
            }

            const findUser = await User.findOne({email});

            if(!findUser) {
                return res.status(401).json({message: 'Người dùng không tồn tại!'})
            }

            const isPassword = await bcrypt.compare(password, findUser.hashedPassword);

            if(!isPassword){
                return res.status(401).json({message:'Mật khẩu không đúng'});
            }

            const accessToken = jwt.sign({userId: findUser._id}, process.env.JWT_SECRET, {expiresIn: ACCESS_TOKEN_TTL});

            const refreshToken = crypto.randomBytes(64).toString('hex');

            await Session.create({
                userId: findUser._id,
                refreshToken,
                expiresAt:new Date( Date.now() + REFRESH_TOKEN_TTL,)
            })
            res.cookie('logged', 1,{
                 httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: REFRESH_TOKEN_TTL,
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: REFRESH_TOKEN_TTL,
             });
            return res.status(200).json({message:'Đăng nhập thành công', accessToken});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({message:'Something went wrong'});
        }
    }
    async signOut(req, res){
        try{
            const  token = req.cookies?.refreshToken;
          
                await Session.deleteOne({refreshToken: token});
                res.clearCookie('refreshToken');
           
             return res.status(200).json({message:'Đăng xuất thành công'});
        }
        catch(error){
            console.error(error);
            return res.status(500).json({message:'Something went wrong'});
        }
    }
    async refreshToken(req, res){
        try{
            const token = req.cookies?.refreshToken;
            if(!token){
                return res.status(401).json({message: 'Token đã hết hạn hoặc không tồn tại123!'})
            }
            const session = await Session.findOne({refreshToken: token})
            if(!session){
                return res.status(403).json({message:'Token đã hết hạn hoặc không tồn tại!'})
            }
            if (session.expiresAt < new Date()) {
                return res.status(403).json({ message: "Token đã hết hạn." });
            }
            const accessToken = jwt.sign(
            {
                userId: session.userId,
            },
                process.env.JWT_SECRET,
                { expiresIn: ACCESS_TOKEN_TTL }
            );

    
            return res.status(200).json({ accessToken });
        }
        catch(error){
            console.error(error);
            return res.status(500).json({message:'Lõi hệ thống!'})
        }
    }
}
export default new authController();