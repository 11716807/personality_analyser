const searchUsers = (messageContent, predefinedUsers) => {
  if (!messageContent.trim()) return [];

  const cleanContent = messageContent.replace(/\n/g, ' ').replace(/[^\w\s]/g, '').toLowerCase();
  const searchTerms = cleanContent.split(' ').filter(term => term.trim() !== '');

  return predefinedUsers.filter(user => searchTerms.some(term => user.toLowerCase().includes(term)));
};

export default searchUsers;