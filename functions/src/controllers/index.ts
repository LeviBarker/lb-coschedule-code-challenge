import { CommentsController } from "./comments/comments";
import { SearchController } from "./search/search";
import { UserRatingController } from "./user-rating/user-rating";

const userRatingController = new UserRatingController();
const searchController = new SearchController();
const commentsController = new CommentsController();

export {
  userRatingController,
  searchController,
  commentsController
};
