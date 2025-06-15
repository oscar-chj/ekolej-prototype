"use client";

import { Avatar, AvatarProps } from "@mui/material";
import { memo } from "react";

interface ProfileAvatarProps extends Omit<AvatarProps, "src" | "alt"> {
  src?: string;
  alt: string;
}

/**
 * Optimized Avatar component that prevents unnecessary image reloads
 * Uses stable keys and proper error handling for profile images
 */
const ProfileAvatar = memo(function ProfileAvatar({
  src,
  alt,
  sx,
  ...props
}: ProfileAvatarProps) {
  const avatarSrc = src || "/default-avatar.png";

  return (
    <Avatar
      {...props}
      alt={alt}
      src={avatarSrc}
      sx={{
        // Default styles
        ...sx,
        // Image optimization
        "& img": {
          loading: "lazy",
        },
      }}
      imgProps={{
        loading: "lazy",
        onError: (e) => {
          // Fallback to default avatar if image fails to load
          const target = e.target as HTMLImageElement;
          if (target.src !== "/default-avatar.png") {
            target.src = "/default-avatar.png";
          }
        },
      }}
    />
  );
});

export default ProfileAvatar;
