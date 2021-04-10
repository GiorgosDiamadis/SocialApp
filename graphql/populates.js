const POPULATE_USER = {
  path: "user",
  model: "User",
};

const POPULATE_FRIENDS = {
  path: "friends",
  model: "User",
};

const POPULATE_COMMENT = {
  path: "comments",
  model: "Comment",
  populate: POPULATE_USER,
};

const POPULATE_LIKES = {
  path: "likes",
  model: "Like",
  populate: POPULATE_USER,
};

module.exports.POPULATE_USER = POPULATE_USER;
module.exports.POPULATE_FRIENDS = POPULATE_FRIENDS;

module.exports.POPULATE_COMMENT = POPULATE_COMMENT;
module.exports.POPULATE_LIKES = POPULATE_LIKES;
