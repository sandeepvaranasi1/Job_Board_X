import User from "../models/User.js";

export const getMyProfile = async (req, res) => {
  res.status(200).json(req.user);
};

export const updateMyProfile = async (req, res) => {
  const { fullName, bio, skills, experience, resumeLink } = req.body;

  const user = req.user;

  user.fullName = fullName || user.fullName;
  user.bio = bio || user.bio;
  user.skills = skills || user.skills;
  user.experience = experience || user.experience;
  user.resumeLink = resumeLink || user.resumeLink;

  const updatedUser = await user.save();
  res.json(updatedUser);
};

export const getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      resumeLink: user.resumeLink,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
