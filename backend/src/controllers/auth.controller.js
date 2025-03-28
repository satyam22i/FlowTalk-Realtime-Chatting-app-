import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utills.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be 6 charactors" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic || " ",
      });

    } else {
      res.status(400).json({ message: "Invalid user deta" });
    }

  } catch (error) {
    console.log("err to signup controller", error.message)
    res.status(500).json({ message: "Internal server error" });

  }
}

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User Not Found" })
    }
    const isPasswordCoreect = await bcrypt.compare(password, user.password)

    if (!isPasswordCoreect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic || " ",
    })

  } catch (error) {
    console.log("err in login controller", error.message)
    res.status(500).json({ message: "Internal server error" })

  }

}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully" })

  } catch (error) {
    console.log("err in logout controller", error.message)
    res.status(500).json({ message: "Internal server error" })

  }

}


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }


    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    if (!uploadResponse.secure_url) {
      return res.status(500).json({ message: "Failed to upload profile picture" });
    }


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cheakAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in cheakAuth controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
}
