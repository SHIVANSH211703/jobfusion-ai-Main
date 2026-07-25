class ProfileDTO {
  static toResponse(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      headline: user.headline,
      bio: user.bio,
      location: user.location,
      experienceLevel: user.experienceLevel,
      skills: user.skills,
      linkedin: user.linkedin,
      github: user.github,
      portfolio: user.portfolio,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

module.exports = ProfileDTO;