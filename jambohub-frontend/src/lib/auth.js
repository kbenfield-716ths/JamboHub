// Authentication and authorization utilities

export function canAccessChannel(user, channel) {
  if (!user || !channel) return false;
  return channel.allowedRoles.includes(user.role);
}

export function canPostInChannel(user, channel) {
  if (!user || !channel) return false;
  return channel.canPost.includes(user.role);
}

export function getUserChannels(user, allChannels) {
  if (!user) return [];
  
  return allChannels.filter(channel => {
    // Can access the channel based on role
    if (!channel.allowedRoles.includes(user.role)) return false;
    
    // If it's a unit channel, must be in that unit (unless parent)
    if (channel.type === 'unit' && user.role !== 'parent') {
      return channel.unit === user.unit;
    }
    
    // Parents can see their child's unit channel
    if (channel.type === 'unit' && user.role === 'parent') {
      return channel.unit === user.unit;
    }
    
    return true;
  });
}

export function getVisibleMessages(user, messages, channel) {
  if (!user || !channel) return [];
  if (!canAccessChannel(user, channel)) return [];
  
  return messages.filter(msg => msg.channelId === channel.id);
}

// YPT Compliance checks
export function isYPTCompliant(channel) {
  // Leadership channels require at least 2 moderators
  if (channel.type === 'unit') {
    return channel.moderators && channel.moderators.length >= 2;
  }
  return true;
}

export function getYPTWarnings(channel) {
  const warnings = [];
  
  if (channel.type === 'unit' && (!channel.moderators || channel.moderators.length < 2)) {
    warnings.push('YPT Warning: This channel needs at least 2 adult moderators');
  }
  
  return warnings;
}
